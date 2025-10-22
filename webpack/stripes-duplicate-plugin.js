// This wrapper around the duplicate-package-checker-webpack-plugin is configured to:
//   Error on specific packages that we never want duplicates of, notably react
//   Warn on any duplicates that are not yet explicitly ignored

const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin');

// Module names that must not have duplicates
const duplicatesNotAllowed = [
  'react',
  'react-dom',
  'react-intl',
  'react-router',
  'react-router-dom',
  'rxjs',
  'stripes',
  'stripes-core',
  'stripes-ui',
  'stripes-components',
  'stripes-connect',
  'stripes-final-form',
  'stripes-form',
  'stripes-smart-components',
];

module.exports = class StripesDuplicatePlugin {
  constructor(options) {
    this.config = options.config || {};
  }

  apply(compiler) {
    // This will surface duplicates as warnings if configured to
    if (this.config.warnAboutAllDuplicatePackages) {
      new DuplicatePackageCheckerPlugin().apply(compiler);
    }


    // This will error when duplicates of specific modules are found
    new DuplicatePackageCheckerPlugin({
      exclude: instance => !duplicatesNotAllowed.includes(instance.name),
      verbose: true,
      emitError: true,
    }).apply(compiler);
  }
};
