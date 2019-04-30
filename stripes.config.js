const platformCore = require('@folio/platform-core/stripes.config.js');
const platformERM = require('@folio/platform-erm/stripes.config.js');
const { merge } = require('lodash');

const platformComplete = {
  modules: {
    '@folio/data-import': {},
    '@folio/eholdings' : {},
    '@folio/finance' : {},
    '@folio/plugin-create-item' : {},
    '@folio/plugin-find-contact' : {},
    '@folio/plugin-find-organization' : {},
  },
  branding: {
    logo: {
      src: './tenant-assets/opentown-libraries-logo.png',
      alt: 'Opentown Libraries',
    },
    favicon: {
      src: './tenant-assets/opentown-libraries-favicon.png',
    },
  }
};

module.exports = merge({}, platformCore, platformERM, platformComplete);
