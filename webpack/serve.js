const webpack = require('webpack');
const path = require('path');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const connectHistoryApiFallback = require('connect-history-api-fallback');
const StripesWebpackPlugin = require('./stripes-webpack-plugin');
const applyWebpackOverrides = require('./apply-webpack-overrides');
const logger = require('./logger')();
const buildConfig = require('../webpack.config.cli.dev');
const sharedStylesConfig = require('../webpack.config.cli.shared.styles');

const cwd = path.resolve();
const platformModulePath = path.join(cwd, 'node_modules');
const coreModulePath = path.join(__dirname, '..', 'node_modules');
const serverRoot = path.join(__dirname, '..');

module.exports = function serve(stripesConfig, options) {
  if (typeof stripesConfig.okapi !== 'object') throw new Error('Missing Okapi config');
  if (typeof stripesConfig.okapi.url !== 'string') throw new Error('Missing Okapi URL');
  if (stripesConfig.okapi.url.endsWith('/')) throw new Error('Trailing slash in Okapi URL will prevent Stripes from functioning');

  return new Promise((resolve) => {
    logger.log('starting serve...');
    const app = express();

    let config = buildConfig(stripesConfig);

    config = sharedStylesConfig(config, {});

    config.plugins.push(new StripesWebpackPlugin({ stripesConfig }));

    // Look for modules in node_modules, then the platform, then stripes-core
    config.resolve.modules = ['node_modules', platformModulePath, coreModulePath];
    config.resolveLoader = { modules: ['node_modules', platformModulePath, coreModulePath] };

    if (options.devtool) {
      config.devtool = options.devtool;
    }
    // Give the caller a chance to apply their own webpack overrides
    config = applyWebpackOverrides(options.webpackOverrides, config);

    logger.log('assign final webpack config', config);
    const compiler = webpack(config);

    compiler.hooks.done.tap('StripesCoreServe', stats => resolve(stats));

    const port = options.port || process.env.STRIPES_PORT || 3000;
    const host = options.host || process.env.STRIPES_HOST || 'localhost';

    const staticFileMiddleware = express.static(`${serverRoot}/public`);

    app.use(staticFileMiddleware);

    // To handle rewrites without the dot rule, we should include the static middleware twice
    // https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite
    app.use(staticFileMiddleware);

    // Process index rewrite before webpack-dev-middleware
    // to respond with webpack's dist copy of index.html
    app.use(connectHistoryApiFallback({
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    }));

    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    }));

    app.use(webpackHotMiddleware(compiler));

    app.listen(port, host, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Listening at http://${host}:${port}`);
    });
  });
};
