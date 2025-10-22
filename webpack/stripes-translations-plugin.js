const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const webpack = require('webpack');
const modulePaths = require('./module-paths');
const logger = require('./logger')('stripesTranslationsPlugin');
const StripesConfigPlugin = require('./stripes-config-plugin');

function prefixKeys(obj, prefix) {
  const res = {};
  for (const key of Object.keys(obj)) {
    res[`${prefix}${key}`] = obj[key];
  }
  return res;
}

module.exports = class StripesTranslationPlugin {
  constructor(options) {
    // Include stripes-core et al because they have translations
    this.modules = {
      '@folio/stripes-core': {},
      '@folio/stripes-components': {},
      '@folio/stripes-smart-components': {},
      '@folio/stripes-form': {},
      '@folio/stripes-ui': {},
    };
    Object.assign(this.modules, options.modules);
    this.languageFilter = options.config.languages || [];
    logger.log('language filter', this.languageFilter);
  }

  apply(compiler) {
    // Used to help locate modules
    this.context = compiler.context;
      // 'publicPath' is not present when running tests via karma-webpack
    // so when running in test mode use absolute 'path'.
    this.publicPath = process.env.NODE_ENV !== 'test' ? compiler.options.output.publicPath : `./absolute${compiler.options.output.path}`;
    this.aliases = compiler.options.resolve.alias;

    // Limit the number of languages loaded by third-party libraries with the ContextReplacementPlugin
    if (this.languageFilter.length) {
      const filterRegex = new RegExp(`(${this.languageFilter.join('|')})`); // constructed regex will look something like /(en|es)/
      new webpack.ContextReplacementPlugin(/react-intl[/\\]locale-data/, filterRegex).apply(compiler);
      new webpack.ContextReplacementPlugin(/moment[/\\]locale/, filterRegex).apply(compiler);
    }

    // Hook into stripesConfigPlugin to supply paths to translation files
    // and gather additional modules from stripes.stripesDeps
    StripesConfigPlugin.getPluginHooks(compiler).beforeWrite.tap({ name: 'StripesTranslationsPlugin', context: true }, (context, config) => {
      // Add stripesDeps
      for (const [key, value] of Object.entries(context.stripesDeps)) {
        // TODO: merge translations from all versions of stripesDeps
        this.modules[key] = value[value.length - 1];
      }

      // Gather all translations available in each module
      const allTranslations = this.gatherAllTranslations();

      const fileData = this.generateFileNames(allTranslations);
      const allFiles = _.mapValues(fileData, data => data.browserPath);

      config.translations = allFiles;
      logger.log('stripesConfigPluginBeforeWrite', config.translations);

      compiler.hooks.thisCompilation.tap('StripesTranslationsPlugin', (compilation) => {
        // Emit merged translations to the output directory
        compilation.hooks.processAssets.tap('StripesTranslationsPlugin', () => {
          Object.keys(allTranslations).forEach((language) => {
            logger.log(`emitting translations for ${language} --> ${fileData[language].emitPath}`);
            const content = JSON.stringify(allTranslations[language]);
            compilation.assets[fileData[language].emitPath] = {
              source: () => content,
              size: () => content.length,
            };
          });
        });
      });
    });
  }

  // Locate each module's translations directory (current) or package.json data (fallback)
  gatherAllTranslations() {
    const allTranslations = {};
    for (const mod of Object.keys(this.modules)) {
      // translations from module dependencies may need to be located relative to their dependent (eg. in yarn workspaces)
      const locateContext = this.modules[mod].resolvedPath || this.context;
      const modPackageJsonPath = modulePaths.locateStripesModule(locateContext, mod, this.aliases, 'package.json');

      if (modPackageJsonPath) {
        const moduleName = StripesTranslationPlugin.getModuleName(mod);
        const modTranslationDir = modPackageJsonPath.replace('package.json', `translations/${moduleName}`);
        if (fs.existsSync(modTranslationDir)) {
          _.merge(allTranslations, this.loadTranslationsDirectory(mod, modTranslationDir));
        } else {
          const modTranslationDirFallback = modPackageJsonPath.replace('package.json', 'translations');
          if (fs.existsSync(modTranslationDirFallback)) {
            logger.log(`cannot find ${modTranslationDir} falling back to ${modTranslationDirFallback}`);
            _.merge(allTranslations, this.loadTranslationsDirectory(mod, modTranslationDirFallback));
          } else {
            logger.log(`cannot find ${modTranslationDirFallback} falling back to ${modPackageJsonPath}`);
            _.merge(allTranslations, this.loadTranslationsPackageJson(mod, modPackageJsonPath));
          }
        }
      } else {
        logger.log(`Unable to locate ${mod} while looking for translations.`);
      }
    }
    return allTranslations;
  }

  // Load translation *.json files from a single module's translation directory
  loadTranslationsDirectory(moduleName, dir) {
    // Load compiled translations if they exist, mixing compiled and uncompiled is acceptable in the final output.
    if (fs.existsSync(`${dir}/compiled`)) {
      dir += '/compiled';
    }

    logger.log('loading translations from directory', dir);
    const moduleTranslations = {};

    let enTranslations = {};
    const enPath = path.join(dir, 'en.json');
    if (fs.existsSync(enPath)) {
      const rawEnTranslations = StripesTranslationPlugin.loadFile(enPath);
      enTranslations = StripesTranslationPlugin.prefixModuleKeys(moduleName, rawEnTranslations);
    }

    for (const translationFile of fs.readdirSync(dir, { withFileTypes: true })) {
      const language = translationFile.name.replace('.json', '');
      // When filter is set, skip other languages. Otherwise loads all
      if (!this.languageFilter.length || this.languageFilter.includes(language)) {
        if (translationFile.isFile()) {
          const translations = StripesTranslationPlugin.loadFile(path.join(dir, translationFile.name));
          moduleTranslations[language] = Object.assign({}, enTranslations, StripesTranslationPlugin.prefixModuleKeys(moduleName, translations));
        } else {
          logger.log(`Could not read translations from ${path.join(dir, translationFile.name)}; it is not a file.`)
        }
      }
    }
    return moduleTranslations;
  }

  // Maintains backwards-compatibility with existing apps
  loadTranslationsPackageJson(moduleName, packageJsonPath) {
    logger.log('loading translations from package.json (legacy)', packageJsonPath);
    const moduleTranslations = {};
    const packageJson = StripesTranslationPlugin.loadFile(packageJsonPath);
    if (packageJson.stripes && packageJson.stripes.translations) {
      for (const language of Object.keys(packageJson.stripes.translations)) {
        // When filter is set, skip other languages. Otherwise loads all
        if (!this.languageFilter.length || this.languageFilter.includes(language)) {
          moduleTranslations[language] = StripesTranslationPlugin.prefixModuleKeys(moduleName, packageJson.stripes.translations[language]);
        }
      }
    }
    return moduleTranslations;
  }

  // Common point for loading and parsing the file facilitates testing
  static loadFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // Could also use require here...
    // return require(filePath); // eslint-disable-line global-require, import/no-dynamic-require
  }

  static getModuleName(module) {
    const name = module.replace(/.*\//, '');
    const moduleName = name.indexOf('stripes-') === 0 ? `${name}` : `ui-${name}`;
    return moduleName;
  }

  // Converts "example.key" for "@folio/app" into "ui-app.example.key"
  static prefixModuleKeys(moduleName, translations) {
    const prefix = `${StripesTranslationPlugin.getModuleName(moduleName)}.`;
    return prefixKeys(translations, prefix);
  }

  // Assign output path names for each to be accessed later by stripes-config-plugin
  generateFileNames(allTranslations) {
    const files = {};
    const timestamp = Date.now(); // To facilitate cache busting, could also generate a hash
    Object.keys(allTranslations).forEach((language) => {
      files[language] = {
        // Fetching from the browser must take into account public path. The replace regex removes double slashes
        browserPath: `${this.publicPath}/translations/${language}-${timestamp}.json`.replace(/\/\//, '/'),
        emitPath: `translations/${language}-${timestamp}.json`,
      };
    });
    return files;
  }
};
