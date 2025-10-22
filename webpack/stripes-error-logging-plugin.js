// This webpack plugin generates a virtual module containing the
// error-logging configuration.

const logger = require('./logger')('stripesErrorLoggingPlugin');
const StripesConfigPlugin = require('./stripes-config-plugin');

module.exports = class StripesErrorLoggingPlugin {
  constructor(options) {
    logger.log('initializing...');

    const defaultErrorLogging = {};

    const tenantErrorLogging = (options && options.tenantErrorLogging) ? options.tenantErrorLogging : {};
    this.errorLogging = Object.assign({}, defaultErrorLogging, tenantErrorLogging);
  }

  apply(compiler) {
    // Hook into stripesConfigPlugin to supply errorLogging config
    StripesConfigPlugin.getPluginHooks(compiler).beforeWrite.tap('StripesTranslationsPlugin', (config) => {
      config.errorLogging = this.errorLogging;
      logger.log('stripesConfigPluginBeforeWrite', config.errorLogging);
    });
  }
};
