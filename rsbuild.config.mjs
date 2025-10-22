import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import { rspack } from '@rspack/core';


const virtualModules = new rspack.experiments.VirtualModulesPlugin({
  'node_modules/module-foo.js': 'module.exports = { foo: "foo" };',
  'node_modules/module-bar.js': 'module.exports = { bar: "bar" };',
  'node_modules/stripes-config.js': `module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    preserveConsole: true,
    useSecureTokens: true,
  },
   };`
});

export default defineConfig({
  plugins: [
    pluginCssMinimizer(),
    pluginReact({
      swcReactOptions: {
        runtime: 'automatic',
//         jsxImportSource: '@emotion/react',
        },
      }
    ),
  ],

  dev: {
    // options for local development
  },
  html: {
    // options for HTML generation
  },
  tools: {
    // options for the low-level tools
    lightningcssLoader: false,
    rspack: {
    plugins: [virtualModules]
    },


  },
  output: {
    // options for build outputs
    cssModules: {
      auto: (resource) => {
        return resource.endsWith('.css');
      },
    },
  },
  resolve: {
    // options for module resolution
  },
  source: {
    entry: {
      css: ['@folio/stripes-components/lib/global.css', '@folio/stripes-components/lib/variables.css'],
      stripesConfig: {
        import: './node_modules/stripes-config.js'
      },
      index: '@folio/stripes-ui',
    },
    include: [
      /node_modules[\\/]@folio[\\/]/,
    ],
  },
  server: {
    // options for the Rsbuild server,
    // will take effect during local development and preview
  },
  security: {
    // options for Web security
  },
  performance: {
    // options for build performance and runtime performance
  },
  moduleFederation: {
    // options for module federation
  },
  environments: {
    // define different Rsbuild configurations for each environment
  },
});
