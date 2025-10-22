const path = require('path');
const postCssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const postCssCustomMedia = require('postcss-custom-media');
const postCssGlobalData = require('@csstools/postcss-global-data');
const postCssRelativeColorSyntax = require('@csstools/postcss-relative-color-syntax');
const postCssOmitImports = require('./webpack/postcss-omit-imports');
const { generateStripesAlias, tryResolve } = require('./webpack/module-paths');

const locateCssVariables = () => {
  const variables = 'lib/variables.css';
  const localPath = path.join(path.resolve(), variables);

  // check if variables are present locally (in cases when stripes-components is
  // being built directly) if not look for them via stripes aliases
  return tryResolve(localPath) ?
    localPath :
    path.join(generateStripesAlias('@folio/stripes-components'), variables);
};

module.exports = {
  plugins: [
    // postcssGlobalData to import custom media queries so that those can be successfully resolve
    postCssGlobalData({
      files: [
        locateCssVariables()
      ]
    }),
    // ignore any imports of variables to keep those from being inlined...
    postCssImport({filter: (path) => !/variables/.test(path)}),
    // strip out imports of variables to prevent variable reset via a custom postcss plugin.
    postCssOmitImports({ contains: /variables/ }),
    autoprefixer(),
    postCssCustomMedia(),
    postCssRelativeColorSyntax(),
  ],
};
