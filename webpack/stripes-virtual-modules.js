// This webpack plugin wraps all other stripes webpack plugins to simplify inclusion within the webpack config

const StripesConfigPlugin = require('./stripes-config-plugin');
const StripesBrandingPlugin = require('./stripes-branding-plugin');
const StripesErrorLoggingPlugin = require('./stripes-error-logging-plugin');
const StripesTranslationsPlugin = require('./stripes-translations-plugin');
const StripesDuplicatesPlugin = require('./stripes-duplicate-plugin');
const logger = require('./logger')('stripesVirtualModules');

export const stripesVirtualModules = (vmPlugin, compiler, options) => {
  logger.log('Creating Stripes plugins...');

  const isProduction = compiler.options.mode === 'production';

  const stripesPlugins = [
    new StripesConfigPlugin(options.stripesConfig),
    new StripesTranslationsPlugin(options.stripesConfig),
    // new StripesDuplicatesPlugin(options.stripesConfig),
  ];

  if (!options.createDll) {
    //@@ compilation halts forever when StripesBrandingPlugin is enabled
    // WTF is it doing?!?
    // stripesPlugins.push(new StripesBrandingPlugin({
    //   tenantBranding: options.stripesConfig.branding,
    //   buildAllFavicons: isProduction,
    // }));

    stripesPlugins.push(new StripesErrorLoggingPlugin({
      tenantErrorLogging: options.stripesConfig.errorLogging,
    }));
  }

  logger.log('Applying Stripes plugins...');
  for (const plugin of stripesPlugins) {
    plugin.apply(compiler, vmPlugin);
  }
};
