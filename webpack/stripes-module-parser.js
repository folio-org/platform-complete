const path = require('path');
const _ = require('lodash');
const semver = require('semver');
const modulePaths = require('./module-paths');
const StripesBuildError = require('./stripes-build-error');
const logger = require('./logger')('stripesModuleParser');

// These config keys do not get exported with type-specific config
const TOP_LEVEL_ONLY = ['permissions', 'icons', 'permissionSets', 'actsAs', 'type', 'hasSettings'];

function appendOrSingleton(maybeArray, newValue) {
  const singleton = [newValue];
  if (Array.isArray(maybeArray)) return maybeArray.concat(singleton);
  return singleton;
}
// Construct and validate expected icon file paths
function buildIconFilePaths(name, root, module, warnings) {
  const iconDir = 'icons';
  const defaultKey = 'high';
  const iconVariants = {
    high: `${name}.svg`,
    low: `${name}.png`,
    // bw: `${name}-bw.png`, example
  };

  return _.reduce(iconVariants, (iconPaths, file, key) => {
    const iconFilePath = path.join(root, iconDir, file);
    const isFound = modulePaths.tryResolve(iconFilePath);
    if (!isFound) {
      warnings.push(`Module ${module} defines icon "${name}" but is missing file "${iconDir}/${file}"`);
    }
    iconPaths[key] = {
      src: isFound ? iconFilePath : '',
    };
    if (key === defaultKey) {
      iconPaths.src = isFound ? iconFilePath : '';
    }
    return iconPaths;
  }, {});
}

function iconPropsFromConfig(icon) {
  return {
    alt: icon.alt,
    title: icon.title,
  };
}


// Handles the parsing of one Stripes module's configuration and metadata
class StripesModuleParser {
  constructor(moduleName, overrideConfig, context, aliases) {
    logger.log(`initializing parser for ${moduleName}...`);
    this.moduleName = moduleName;
    this.modulePath = '';
    this.nameOnly = moduleName.replace(/.*\//, '');
    this.overrideConfig = overrideConfig;
    this.packageJson = this.loadModulePackageJson(context, aliases);
    this.warnings = [];
  }

  // Loads a given module's package.json and errors when it fails
  // By using require, the JSON will already be parsed
  loadModulePackageJson(context, aliases) {
    const packageJsonFile = modulePaths.locateStripesModule(context, this.moduleName, aliases, 'package.json');
    if (!packageJsonFile) {
      throw new StripesBuildError(`StripesModuleParser: Unable to locate ${this.moduleName}'s package.json`);
    }
    this.modulePath = packageJsonFile.replace('package.json', '');
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(packageJsonFile);
  }

  // Wrapper to source data and transform into collections (config and metadata)
  parseModule() {
    const stripes = this.packageJson.stripes;
    if (!_.isObject(stripes)) {
      throw new StripesBuildError(`Included module ${this.moduleName} does not have a "stripes" key in package.json`);
    }

    // Upgrade string actsAs to singleton array and provide compatibility for deprecated options
    let actsAs = stripes.actsAs;
    if (!Array.isArray(actsAs)) {
      if (typeof actsAs === 'string') actsAs = [actsAs];
      else if (typeof stripes.type === 'string') {
        this.warnings.push(`Module ${this.moduleName} uses deprecated "type" property. Prefer "actsAs".`);
        actsAs = [stripes.type];
        if (stripes.hasSettings && stripes.type !== 'settings') {
          this.warnings.push(`Module ${this.moduleName} uses deprecated "hasSettings" property. Instead, add "settings" to the "actsAs" array and render your settings component when your main component is passed the prop 'actAs="settings"'.`);
          actsAs.push('settings');
        }
        if (stripes.handlerName) {
          this.warnings.push(`Module ${this.moduleName} uses deprecated "handlerName" property. Instead, add "handler" to the "actsAs" array and render your handler component when your main component is passed the prop 'actAs="handler"'.`);
          actsAs.push('settings');
        }
      } else {
        throw new StripesBuildError(`Included module ${this.moduleName} does not specify stripes.actsAs in package.json`);
      }
    }

    return {
      name: this.nameOnly,
      actsAs,
      config: this.config || this.parseStripesConfig(this.moduleName, this.packageJson),
      metadata: this.metadata || this.parseStripesMetadata(this.packageJson),
    };
  }

  // Validates and parses a module's stripes data
  parseStripesConfig(moduleName, packageJson) {
    const { stripes, description, version } = packageJson;
    const getModule = new Function([], `return require('${moduleName}').default;`);
    const stripesConfig = _.omit(Object.assign({}, stripes, this.overrideConfig, {
      module: moduleName,
      getModule,
      description,
      version,
    }), TOP_LEVEL_ONLY);
    logger.log('config:', stripesConfig);

    return stripesConfig;
  }

  // Extract metadata defined here:
  // https://github.com/folio-org/stripes-core/blob/master/doc/app-metadata.md
  parseStripesMetadata(packageJson) {
    const icons = this.getIconMetadata(packageJson.stripes.icons, packageJson.stripes.type === 'app');
    const welcomePageEntries = this.getWelcomePageEntries(packageJson.stripes.welcomePageEntries, icons);

    const metadata = {
      name: this.nameOnly,
      version: packageJson.version,
      description: packageJson.description,
      license: packageJson.license,
      feedback: packageJson.bugs,
      type: packageJson.stripes.type,
      shortTitle: packageJson.stripes.displayName,
      fullTitle: packageJson.stripes.fullName,
      defaultPopoverSize: packageJson.stripes.defaultPopoverSize,
      defaultPreviewWidth: packageJson.stripes.defaultPreviewWidth,
      helpPage: packageJson.stripes.helpPage,
      icons,
      welcomePageEntries,
    };
    logger.log('metadata:', metadata);
    return metadata;
  }

  getIconMetadata(icons, isApp) {
    if (!icons || !Array.isArray(icons)) {
      if (isApp) this.warnings.push(`Module ${this.moduleName} has no icons defined in stripes.icons`);
      return {};
    }
    return _.reduce(icons, (iconMetadata, icon) => {
      iconMetadata[icon.name] = iconPropsFromConfig(icon);
      // The icon's name will be used in the event fileName is not specified
      Object.assign(iconMetadata[icon.name], this.buildIconFilePaths(icon.fileName || icon.name));
      return iconMetadata;
    }, {});
  }

  // Construct and validate expected icon file paths
  buildIconFilePaths(name) {
    return buildIconFilePaths(name, this.modulePath, this.moduleName, this.warnings);
  }

  getWelcomePageEntries(entries, icons) {
    if (!entries || !Array.isArray(entries)) {
      return [];
    }
    return _.map(entries, (entry) => {
      if (!icons[entry.iconName]) {
        this.warnings.push(`Module ${this.moduleName} defines welcome page entry icon "${entry.iconName}" with no matching stripes.icons definition`);
      }
      return {
        iconName: entry.iconName,
        headline: entry.headline,
        description: entry.description,
      };
    });
  }
}

// The helper loops over a tenant's enabled modules and parses each module
// The resulting config is grouped by stripes module type (app, settings, plugin, etc.)
// The metadata is grouped by module name
function parseAllModules(enabledModules, context, aliases) {
  const allModuleConfigs = {
    app: [],
  };
  const allMetadata = {};
  const unsortedStripesDeps = {};
  const icons = {};
  let warnings = [];

  _.forOwn(enabledModules, (overrideConfig, moduleName) => {
    const moduleParser = new StripesModuleParser(moduleName, overrideConfig, context, aliases);
    const parsedModule = moduleParser.parseModule();

    // config
    parsedModule.actsAs.forEach(type => {
      allModuleConfigs[type] = appendOrSingleton(allModuleConfigs[type], parsedModule.config);
    });

    // metadata
    allMetadata[parsedModule.name] = parsedModule.metadata;

    // stripesDeps
    const config = parsedModule.config;
    if (Array.isArray(config.stripesDeps)) {
      config.stripesDeps.forEach(dep => {
        // locate dep relative to the module that depends on it
        const depContext = modulePaths.locateStripesModule(context, config.module, aliases, 'package.json');
        const packageJsonPath = modulePaths.locateStripesModule(depContext, dep, aliases, 'package.json');
        if (!packageJsonPath) {
          throw new StripesBuildError(`StripesModuleParser: Unable to locate ${dep}'s package.json (dependency of ${config.module})`);
        }
        const packageJson = require(packageJsonPath);
        const resolvedPath = packageJsonPath.replace('/package.json', '');
        unsortedStripesDeps[dep] = appendOrSingleton(unsortedStripesDeps[dep], {
          name: dep,
          dependencyOf: config.module,
          resolvedPath,
          version: packageJson.version,
          ...(packageJson.stripes && packageJson.stripes.icons ? { icons: packageJson.stripes.icons } : {})
        });
      });
    }

    // icons
    icons[parsedModule.config.module] = parsedModule.metadata.icons;

    // warnings
    if (moduleParser.warnings.length) {
      warnings = warnings.concat(moduleParser.warnings);
    }
  });

  // stripesDeps are then sorted so that resources will be gathered from the newest version where they are available
  const stripesDeps = {};
  for (const [key, value] of Object.entries(unsortedStripesDeps)) {
    stripesDeps[key] = value.sort((a, b) => semver.compare(a.version, b.version));
  }

  // icons from deps
  const anyHasIcon = vers => vers.reduce((acc, dep) => (acc || ('icons' in dep)), false);
  const mergeIcons = vers => vers.reduce((depIcons, ver) => {
    if ('icons' in ver) {
      ver.icons.forEach(icon => {
        depIcons[icon.name] = {
          ...iconPropsFromConfig(icon),
          ...buildIconFilePaths(icon.fileName || icon.name, ver.resolvedPath, ver.name, warnings)
        };
      });
    }
    return depIcons;
  }, {});
  for (const [key, value] of Object.entries(stripesDeps)) {
    if (anyHasIcon(value)) {
      icons[key] = mergeIcons(value);
    }
  }

  return {
    config: allModuleConfigs,
    metadata: allMetadata,
    stripesDeps,
    icons,
    warnings,
  };
}

module.exports = {
  StripesModuleParser,
  parseAllModules,
};
