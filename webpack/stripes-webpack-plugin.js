// This webpack plugin wraps all other stripes webpack plugins to simplify inclusion within the webpack config

const StripesConfigPlugin = require('./stripes-config-plugin');
const StripesBrandingPlugin = require('./stripes-branding-plugin');
const StripesErrorLoggingPlugin = require('./stripes-error-logging-plugin');
const StripesTranslationsPlugin = require('./stripes-translations-plugin');
const StripesDuplicatesPlugin = require('./stripes-duplicate-plugin');
const logger = require('./logger')('stripesWebpackPlugin');

module.exports = class StripesWebpackPlugin {
  constructor(options) {
    this.stripesConfig = options.stripesConfig;
    this.createDll = options.createDll;
  }

  apply(compiler) {
    logger.log('Creating Stripes plugins...');
    const isProduction = compiler.options.mode === 'production';

    const stripesPlugins = [
      new StripesConfigPlugin(this.stripesConfig),
      new StripesTranslationsPlugin(this.stripesConfig),
      new StripesDuplicatesPlugin(this.stripesConfig),
    ];

    if (!this.createDll) {
      stripesPlugins.push(new StripesBrandingPlugin({
        tenantBranding: this.stripesConfig.branding,
        buildAllFavicons: isProduction,
      }));

      stripesPlugins.push(new StripesErrorLoggingPlugin({
        tenantErrorLogging: this.stripesConfig.errorLogging,
      }));
    }

    logger.log('Applying Stripes plugins...');
    stripesPlugins.forEach(plugin => plugin.apply(compiler));
  }
};
