const platformCore = require('@folio/platform-core/stripes.config.js');
const platformERM = require('@folio/platform-erm/stripes.config.js');
const { merge } = require('lodash');

const platformComplete = {
  modules: {
    '@folio/agreements': {},
    '@folio/calendar' : {},
    '@folio/checkin' : {},
    '@folio/checkout' : {},
    '@folio/circulation' : {},
    '@folio/data-import': {},
    '@folio/developer' : {},
    '@folio/eholdings' : {},
    '@folio/erm-usage': {},
    '@folio/inventory' : {},
    '@folio/finance' : {},
    '@folio/licenses': {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/orders': {},
    '@folio/organization' : {},
    '@folio/plugin-create-item' : {},
    '@folio/plugin-find-agreement': {},
    '@folio/plugin-find-instance' : {},
    '@folio/plugin-find-contact' : {},
    '@folio/plugin-find-license': {},
    '@folio/plugin-find-organization' : {},
    '@folio/plugin-find-user' : {},
    '@folio/plugin-find-vendor': {},
    '@folio/requests' : {},
    '@folio/search' : {},
    '@folio/servicepoints' : {},
    '@folio/stripes-erm-components': {},
    '@folio/tags': {},
    '@folio/tenant-settings' : {},
    '@folio/users' : {},
    '@folio/vendors': {}

  },
  branding: {
    logo: {
      src: './tenant-assets/opentown-libraries-logo.png',
      alt: 'Opentown Libraries',
    },
    favicon: {
      src: './tenant-assets/folio-favicon.png',
    },
  }
};

module.exports = merge({}, platformCore, platformERM, platformComplete);
