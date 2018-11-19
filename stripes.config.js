const platformCore = require('@folio/platform-core/stripes.config.js');
const { merge } = require('lodash');

const platformComplete = {
  modules: {
    '@folio/calendar' : {},
    '@folio/eholdings' : {},
    '@folio/finance' : {},
    '@folio/vendors' : {}
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

module.exports = merge({}, platformCore, platformComplete);
