// const platformCore = require('@folio/platform-core/stripes.config.js');
// const platformERM = require('@folio/platform-erm/stripes.config.js');
// const { merge } = require('lodash');

module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    showPerms: false
  },

  modules: {
    '@folio/acquisition-units': {},
    '@folio/agreements' : {},
    '@folio/calendar' : {},
    '@folio/checkin' : {},
    '@folio/checkout' : {},
    '@folio/circulation' : {},
    '@folio/courses' : {},
    '@folio/data-import' : {},
    '@folio/data-export' : {},
    '@folio/developer' : {},
    '@folio/eholdings' : {},
    '@folio/erm-usage' : {},
    '@folio/inventory' : {},
    '@folio/invoice' : {},
    '@folio/finance' : {},
    '@folio/licenses' : {},
    '@folio/local-kb-admin': {},
    '@folio/marccat' : {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/oai-pmh' : {},
    '@folio/orders' : {},
    '@folio/organizations' : {},
    '@folio/plugin-create-item' : {},
    '@folio/plugin-find-agreement' : {},
    '@folio/plugin-find-erm-usage-data-provider' : {},
    '@folio/plugin-find-import-profile' : {},
    '@folio/plugin-find-instance' : {},
    '@folio/plugin-find-contact' : {},
    '@folio/plugin-find-interface' : {},
    '@folio/plugin-find-license' : {},
    '@folio/plugin-find-organization' : {},
    '@folio/plugin-find-po-line': {},
    '@folio/plugin-find-user' : {},
    '@folio/quick-marc' : {},
    '@folio/receiving' : {},
    '@folio/requests' : {},
    '@folio/search' : {},
    '@folio/servicepoints' : {},
    '@folio/stripes-erm-components' : {},
    '@folio/stripes-data-transfer-components' : {},
    '@folio/tags' : {},
    '@folio/tenant-settings' : {},
    '@folio/users' : {}
  },

  branding: {
    logo: {
      src: './tenant-assets/opentown-libraries-logo.png',
      alt: 'Opentown Libraries',
    },
    favicon: {
      src: './tenant-assets/folio-favicon.png',
    },
  },
};

// module.exports = merge({}, platformCore, platformERM, platformComplete);
