const path = require('path');

// Serialize an object
// In the process, it wraps "src" properties with requires for loading files
function serializeWithRequire(theObject) {
  const assetPath = (thePath) => {
    if (path.isAbsolute(thePath)) {
      return thePath;
    }

    return path.join('..', thePath); // Look outside the node_modules directory
  };

  // Wraps image paths with require()'s for webpack to process via its file loaders
  // The require()'s are just strings here so we don't attempt to invoke them right now
  const injectRequire = (key, value) => {
    if (key === 'src' && typeof value === 'string' && value !== '') {
      return `require('${assetPath(value)}')`;
    }

    return value;
  };
  // Serialize whole configuration, adding require()'s as needed
  const theString = JSON.stringify(theObject, injectRequire, 2);

  // Now that the object has been serialized, this regex omits the wrapping quotes
  // surrounding the require()'s so they are invoked when Webpack loads stripes-config
  return theString.replace(/"(require\([^)]+\))"/g, (match, $1) => $1);
}

module.exports = {
  serializeWithRequire,
};
