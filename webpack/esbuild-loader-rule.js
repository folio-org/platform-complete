const path = require('path');

const babelOptions = require('./babel-options');
const {
  getNonTranspiledModules,
  getTranspiledModules,
} = require('./module-paths');

// a space delimited list of strings (typically namespaces) to use in addition
// to "@folio" to determine if something needs Stripes-flavoured transpilation
const extraTranspile = process.env.STRIPES_TRANSPILE_TOKENS ? new RegExp(process.env.STRIPES_TRANSPILE_TOKENS.replaceAll(' ', '|')) : '';

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486
const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const bigTestRegex = /bigtest|interactor/i;
const nodeModulesRegex = /node_modules/;

module.exports = (modulePaths) => {
  const modulesToTranspile = getNonTranspiledModules(modulePaths);
  const transpiledModules = getTranspiledModules(modulePaths);
  let includeRegex;
  let excludeRegex;

  if (modulesToTranspile.length) {
    includeRegex = new RegExp(modulesToTranspile.map(escapeRegExp).join('|'));
    console.info('\nmodules to transpile:\n');
    modulesToTranspile.sort().forEach(m => console.log(m));
  }

  if (transpiledModules.length) {
    excludeRegex = new RegExp(transpiledModules.map(escapeRegExp).join('|'))
    console.info('\ntranspiled modules:\n');
    transpiledModules.forEach(m => console.log(m));
  }

  const folioModulePath = path.join('node_modules', '@folio');
  // A negative lookahead regex to find @folio modules present in node_modules
  // which are still not transpiled ('dist' folder is not present).
  // This currently happens when folio module is not listed in stripes config
  // or under stripes.stripesDeps and another folio module includes it as a dependency.
  // TODO: remove this after all modules are transpiled
  const folioModulesRegex = new RegExp(`${escapeRegExp(folioModulePath)}(?!.*dist)`);

  const shouldModuleBeIncluded = (modulePath) => {
    // exclude empty modules
    if (!modulePath) {
      return false;
    }

    // regex which represents modules which should be included for transpilation
    if (includeRegex && includeRegex.test(modulePath)) {
      return true;
    }

    // include STRIPES_TRANSPILE_TOKENS in transpilation
    if (extraTranspile && extraTranspile.test(modulePath)) {
      return true;
    }

    // regex which represents modules which should be excluded from transpilation
    if (excludeRegex && excludeRegex.test(modulePath)) {
      return false;
    }

    // if untranspiled @folio module is present in node_modules
    // just transpile it
    if (folioModulesRegex.test(modulePath)) {
      return true;
    }

    // skip everything from node_modules
    if (nodeModulesRegex.test(modulePath)) {
      return false;
    }

    return true;
  }

  return {
    test: /\.js$/,
    include: shouldModuleBeIncluded,
    oneOf: [
      {
        // handle all bigtest files and interactor files via babel
        // due to a decorator format issue.
        // https://issues.folio.org/browse/STRWEB-78
        test: filePath => !filePath.match(bigTestRegex),
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              jsx: 'automatic',
            },
          },
        ],
      },
      {
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              ...babelOptions,
            },
          },
        ],
      },
   ],
  };
};
