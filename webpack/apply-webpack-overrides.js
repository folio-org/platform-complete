const logger = require('./logger')();

// Applies overrides to the webpack configuration
// Supports a function or an array of functions

module.exports = function applyWebpackOverrides(overrides, originalConfig) {
  logger.log('applying webpack overrides...');
  let config = originalConfig;

  if (overrides && typeof overrides === 'function') {
    config = overrides(config);
  } else if (overrides && Array.isArray(overrides)) {
    for (let i = 0; i < overrides.length; i += 1) {
      if (overrides[i] && typeof overrides[i] === 'function') {
        config = overrides[i](config);
      }
    }
  }

  return config;
};
