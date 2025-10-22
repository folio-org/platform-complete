const path = require('path');
const logger = require('./logger')();
const StripesBuildError = require('./stripes-build-error');

function tryResolve(modulePath, options) {
  try {
    return require.resolve(modulePath, options);
  } catch (e) {
    return false;
  }
}

// Generates a resolvable alias for a module with preference given to the
// workspace's version followed by stripes-core's version followed by the platform's, if available
function generateStripesAlias(moduleName) {
  let alias;
  const workspaceModule = path.join(path.resolve(), '..', 'node_modules', moduleName);
  const platformModule = path.join(path.resolve(), 'node_modules', moduleName);
  const coreModule = path.join(__dirname, '..', 'node_modules', moduleName);

  if (tryResolve(workspaceModule)) {
    alias = workspaceModule;
  } else if (tryResolve(platformModule)) {
    alias = platformModule;
  } else if (tryResolve(coreModule)) {
    alias = coreModule;
  } else {
    throw new StripesBuildError(`generateStripesAlias: Unable to locate a resolvable alias for ${moduleName} module`);
  }
  return alias;
}

// Common logic to locate a stripes module (pass 'package.json') or file within
function locateStripesModule(context, moduleName, alias, ...segments) {
  logger.log(`locating stripes module ${moduleName}...`);
  let foundPath = false;

  const tryPaths = [
    {
      // The place we normally expect to find this module
      request: path.join(context, 'node_modules', moduleName, ...segments),
    }, {
      // The above resolution is overspecific and prevents some use cases eg. yarn workspaces
      request: path.join(moduleName, ...segments),
    }, {
      // This better incorporates the context path but requires nodejs 9+
      request: path.join(moduleName, ...segments),
      options: { paths: [context] },
    }, {
      // Yarn workspaces fallback: Try node_modules of the parent directory
      request: path.join(context, '..', 'node_modules', moduleName, ...segments),
    },
  ];

  // If we are looking for any stripes-* modules, we should also check within the framework's node_modules
  if (moduleName.startsWith('@folio/stripes')) {
    tryPaths.unshift({
      request: path.join(context, 'node_modules', '@folio', 'stripes', 'node_modules', moduleName, ...segments),
    }, {
      // Yarn workspace fallback
      request: path.join(context, '..', 'node_modules', '@folio', 'stripes', 'node_modules', moduleName, ...segments),
    });
  }

  // When available, try for the alias first
  if (alias[moduleName]) {
    tryPaths.unshift({
      request: path.join(alias[moduleName], ...segments),
    });
  }

  for (let i = 0; i < tryPaths.length; i += 1) {
    foundPath = tryResolve(tryPaths[i].request, tryPaths[i].options);
    if (foundPath) {
      break;
    }
  }
  if (foundPath) {
    logger.log('found', foundPath);
  }
  return foundPath;
}

/**
 * Returns a full path of package.json for a given module.
 */
function locatePackageJsonPath(moduleName) {
  const packageJsonPath = locateStripesModule(process.cwd(), moduleName, {}, 'package.json');

  // Also check package.json in the current cwd dir.
  // This handles a case when `stripes serve` is executed for a single ui module (within the module).
  if (!packageJsonPath) {
    const localPath = tryResolve(path.join(process.cwd(), 'package.json'));

    if (localPath) {
      const packageJson = require(localPath);
      // make sure it's the same package name as depName
      if (packageJson.name === moduleName) {
        return localPath;
      }
    }
  }

  return packageJsonPath;
}

/**
 * Convert dependencies defined in "stripes.stripesDeps" in package.json
 * into their full path representation.
 *
 * For example dependencies defined as:
 *
 * "stripesDeps": [
    "@reshare/stripes-reshare",
  ],
 *
 * will be converted to:
 *
 * [
 *  './node_modules/@reshare/stripes-reshare'
 * ]
 *
*/
function getStripesDepsPaths(packageJsonPath) {
  const packageJson = require(packageJsonPath);
  const stripes = packageJson.stripes || {};

  if (!stripes.stripesDeps) {
    return null;
  }

  const stripesDeps = stripes.stripesDeps;

  return stripesDeps.map(dep => {
    const packageJsonPath = locatePackageJsonPath(dep);
    return packageJsonPath ? path.dirname(packageJsonPath) : null;
  });
}

/**
 * Convert modules defined in stripes config into their full path representation.
 * The conversion will happen for all modules found in stripes config.
 *
 * For example modules defined in stripes config:
 *
 * modules: { '@folio/users': {}, '@reshare/directory': {} }
 *
 * will be converted to:
 *
 * [
 *  './node_modules/@folio/users',
 *  './node_modules/@reshare/directory'
 * ]
 *
 *
*/
function getModulesPaths(modules) {
  return Object
    .keys(modules)
    .flatMap(module => {
      const packageJsonPath = locatePackageJsonPath(module);

      if (packageJsonPath) {
        const modulePaths = [path.dirname(packageJsonPath)];
        const stripesDepPaths = getStripesDepsPaths(packageJsonPath);

        if (stripesDepPaths) {
          modulePaths.push(...stripesDepPaths);
        }

        return modulePaths
      }

      return null;
    })
    .filter(module => !!module);
}

/**
 * Return full paths for all stripes dependencies defined in:
 *
 * https://github.com/folio-org/stripes/blob/ab01ed9c8d60d020d76f5682406b3bf901c24e76/package.json#L20-L27
 *
*/
function getStripesModulesPaths() {
  const packageJsonPath = locatePackageJsonPath('@folio/stripes');
  const paths = [];

  if (!packageJsonPath) {
    return paths;
  }

  const packageJson = require(packageJsonPath);

  if (!packageJson) {
    return paths;
  }

  Object.keys(packageJson.dependencies).forEach(moduleName => {
    if (moduleName.match('@folio')) {
      const stripesModulePath = locatePackageJsonPath(moduleName);

      if (stripesModulePath) {
        paths.push(path.dirname(stripesModulePath));
      }
    }
  });

  return paths;
}

function getNonTranspiledModules(modules) {
  const nonTranspiledModules = ['stripes-config'];

  modules.forEach(module => {
    const distPath = tryResolve(path.join(module, 'dist'));
    if (!distPath) {
      nonTranspiledModules.push(module.split(path.sep).pop());
    }
  });

  return [...new Set(nonTranspiledModules)];
}

function getTranspiledModules(modules) {
  const transpiledModules = [];

  modules.forEach(module => {
    const distPath = tryResolve(path.join(module, 'dist'));

    if (distPath) {
      transpiledModules.push(distPath);
    }
  });

  return transpiledModules;
}

function getTranspiledCssPaths(modules) {
  const cssPaths = [];

  modules.forEach(module => {
    const cssPath = tryResolve(path.join(module, 'dist', 'style.css'));

    if (cssPath) {
      cssPaths.push(cssPath);
    }
  });

  return cssPaths;
}

function getSharedStyles(filename) {
  return path.resolve(generateStripesAlias('@folio/stripes-components'), `${filename}.css`);
}

module.exports = {
  tryResolve,
  generateStripesAlias,
  getSharedStyles,
  locateStripesModule,
  getModulesPaths,
  getStripesModulesPaths,
  getNonTranspiledModules,
  getTranspiledModules,
  getTranspiledCssPaths,
};
