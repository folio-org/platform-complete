// This webpack plugin generates a virtual module containing the stripes tenant branding configuration
// The virtual module contains require()'s needed for webpack to pull images into the bundle.

const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const defaultBranding = require('../default-assets/branding');
const logger = require('./logger')('stripesBrandingPlugin');
const StripesConfigPlugin = require('./stripes-config-plugin');

// Minimal favicon settings for favicons-webpack-plugin
const standardFaviconsOnly = {
  android: false,
  appleIcon: false,
  appleStartup: false,
  coast: false,
  favicons: true,
  firefox: false,
  windows: false,
  yandex: false,
};

// Complete favicon settings for favicons-webpack-plugin
const allFavicons = {
  android: true,
  appleIcon: true,
  appleStartup: true,
  coast: true,
  favicons: true,
  firefox: true,
  windows: true,
  yandex: true,
};

module.exports = class StripesBrandingPlugin {
  constructor(options) {
    logger.log('initializing...');
    // TODO: Validate incoming tenantBranding paths
    const tenantBranding = (options && options.tenantBranding) ? options.tenantBranding : {};
    this.branding = Object.assign({}, defaultBranding, tenantBranding);
    this.buildAllFavicons = options && options.buildAllFavicons;
  }

  apply(compiler) {
    // favicons-webpack-plugin will inject the necessary html via HtmlWebpackPlugin
    const faviconOptions = this._getFaviconOptions();
    new FaviconsWebpackPlugin(faviconOptions).apply(compiler);

    // Hook into stripesConfigPlugin to supply branding config
    StripesConfigPlugin.getPluginHooks(compiler).beforeWrite.tap('StripesTranslationsPlugin', (config) => {
      config.branding = this.branding;
      logger.log('stripesConfigPluginBeforeWrite', config.branding);
    });
  }

  _getFaviconOptions() {
    const faviconOptions = {
      logo: StripesBrandingPlugin._initFavicon(this.branding.favicon.src),
      icons: this.buildAllFavicons ? allFavicons : standardFaviconsOnly,
    };
    logger.log('favicon options', faviconOptions);
    return faviconOptions;
  }

  // Prep favicon path for use with HtmlWebpackPlugin
  static _initFavicon(favicon) {
    if (path.isAbsolute(favicon)) {
      return favicon;
    }
    return path.join(path.resolve(), favicon);
  }
};
