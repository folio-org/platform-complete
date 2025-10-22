const path = require('path');
const webpack = require('webpack');
const applyWebpackOverrides = require('./apply-webpack-overrides');
const logger = require('./logger')();
const { tryResolve } = require('./module-paths');
const { processExternals } = require('./utils');

module.exports = function transpile(options = {}) {
  return new Promise((resolve, reject) => {
    logger.log('starting build...');
    let config = require('../webpack.config.cli.transpile');

    // TODO: allow for name customization
    const moduleTranspileConfigPath = path.join(process.cwd(), 'webpack.transpile.config.js');
    const packagePath = path.join(process.cwd(), 'package.json');

    if (tryResolve(packagePath)) {
      const packageJson = require(packagePath);
      const { name, peerDependencies } = packageJson;

      config.output.library = {
        type: 'umd',
        name,
      };

      if (peerDependencies) {
        config.externals = processExternals(peerDependencies);
      }
    }

    if (tryResolve(moduleTranspileConfigPath)) {
      const moduleTranspileConfig = require(moduleTranspileConfigPath);
      moduleTranspileConfig.externals = { ...config.externals, ...moduleTranspileConfig.externals };
      config = { ...config, ...moduleTranspileConfig };
    }

    // Give the caller a chance to apply their own webpack overrides
    config = applyWebpackOverrides(options.webpackOverrides, config);

    const compiler = webpack(config);

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};
