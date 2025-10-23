import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import { rspack } from '@rspack/core';

import StripesWebpackPlugin from './webpack/stripes-webpack-plugin';
import { stripesVirtualModules } from './webpack/stripes-virtual-modules';

//@@ how to get this dynamically?
import stripesConfig from './stripes.config';

const vmPlugin = new rspack.experiments.VirtualModulesPlugin();

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
      plugins: [
        // _virtualModules,
        vmPlugin,
        // {
        //   apply(compiler) {
        //     compiler.hooks.thisCompilation.tap('MyPlugin', () => {
        //       vmPlugin.writeModule('node_modules/stripes-config.js', _stripesConfigContent);
        //     });
        //   }
        // }
        {
          apply(compiler) {
            stripesVirtualModules(vmPlugin, compiler, { stripesConfig, createDll: false });
          }
        },
      ]
    },
  },
  output: {
    // options for build outputs
    sourceMap: {
      js: 'source-map',
    },

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
