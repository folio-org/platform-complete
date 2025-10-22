// This webpack plugin generates a virtual module containing the stripes configuration
// To access this configuration simply import 'stripes-config' within your JavaScript:
//   import { okapi, config, modules } from 'stripes-config';
//
// NOTE: If importing module data for UI purposes such as displaying
// the module name, DO NOT import this module.
// Instead, use the ModulesContext directly or via the withModules/withModule HOCs.

const _ = require('lodash');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const serialize = require('serialize-javascript');
const { SyncHook } = require('tapable');
const stripesModuleParser = require('./stripes-module-parser');
const StripesBuildError = require('./stripes-build-error');
const stripesSerialize = require('./stripes-serialize');
const logger = require('./logger')('stripesConfigPlugin');

const stripesConfigPluginHooksMap = new WeakMap();

module.exports = class StripesConfigPlugin {
  constructor(options) {
    logger.log('initializing...');
    if (!_.isObject(options.modules)) {
      throw new StripesBuildError('stripes-config-plugin was not provided a "modules" object for enabling stripes modules');
    }
    this.options = _.omit(options, 'branding', 'errorLogging');
  }

  // Establish hooks for other plugins to update the config, providing existing config as context
  static getPluginHooks = (compiler) => {
    let hooks = stripesConfigPluginHooksMap.get(compiler);

    if (!hooks) {
      hooks = {
        beforeWrite: new SyncHook(['config']),
      };

      stripesConfigPluginHooksMap.set(compiler, hooks);
    }

    return hooks;
  }

  apply(compiler) {
    const enabledModules = this.options.modules;
    logger.log('enabled modules:', enabledModules);
    const { config, metadata, icons, stripesDeps, warnings } = stripesModuleParser.parseAllModules(enabledModules, compiler.context, compiler.options.resolve.alias);
    this.mergedConfig = Object.assign({}, this.options, { modules: config });
    this.metadata = metadata;
    this.icons = icons;
    this.warnings = warnings;
    // Prep the virtual module now, we will write to it when ready
    this.virtualModule = new VirtualModulesPlugin();
    this.virtualModule.apply(compiler);

    StripesConfigPlugin.getPluginHooks(compiler).beforeWrite.tap(
      { name: 'StripesConfigPlugin', context: true },
      context => Object.assign(context, { config, metadata, icons, stripesDeps, warnings }));

    // Wait until after other plugins to generate virtual stripes-config
    compiler.hooks.afterPlugins.tap('StripesConfigPlugin', (theCompiler) => this.afterPlugins(theCompiler));
    compiler.hooks.emit.tapAsync('StripesConfigPlugin', (compilation, callback) => this.processWarnings(compilation, callback));
  }

  afterPlugins(compiler) {
    // Data provided by other stripes plugins via hooks
    const pluginData = {
      branding: {},
      errorLogging: {},
      translations: {},
    };

    StripesConfigPlugin.getPluginHooks(compiler).beforeWrite.call(pluginData);

    // Create a virtual module for Webpack to include in the build
    const stripesVirtualModule = `
      const { okapi, config, modules } = ${serialize(this.mergedConfig, { space: 2 })};
      const branding = ${stripesSerialize.serializeWithRequire(pluginData.branding)};
      const errorLogging = ${stripesSerialize.serializeWithRequire(pluginData.errorLogging)};
      const translations = ${serialize(pluginData.translations, { space: 2 })};
      const metadata = ${stripesSerialize.serializeWithRequire(this.metadata)};
      const icons = ${stripesSerialize.serializeWithRequire(this.icons)};
      export { okapi, config, modules, branding, errorLogging, translations, metadata, icons };
    `;

    logger.log('writing virtual module...', stripesVirtualModule);
    this.virtualModule.writeModule('node_modules/stripes-config.js', stripesVirtualModule);
  }

  processWarnings(compilation, callback) {
    if (this.warnings.length) {
      compilation.warnings.push(new StripesBuildError(`stripes-config-plugin:\n  ${this.warnings.join('\n  ')}`));
    }
    callback();
  }
};
