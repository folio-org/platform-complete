// const platformCore = require('@folio/platform-core/stripes.config.js');
// const platformERM = require('@folio/platform-erm/stripes.config.js');
// const { merge } = require('lodash');

module.exports = {
  okapi: {
    uiUrl: 'http://folio-edev-volaris-consortium.ci.folio.org',
    authnUrl: 'https://folio-edev-volaris-keycloak.ci.folio.org',
    url: 'https://ecs-folio-edev-volaris-kong.ci.folio.org',
  },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    useSecureTokens: true,
    showPerms: false,
    tenantOptions: {
      consortium: { name: 'consortium', clientId: 'consortium-application' },
    },
  },

  modules: {
    '@folio/inn-reach' : {},
    '@folio/plugin-find-user' : {},
    '@folio/plugin-find-import-profile' : {},
    '@folio/checkin' : {},
    '@folio/checkout' : {},
    '@folio/circulation' : {},
    '@folio/circulation-log' : {},
    '@folio/inventory' : {},
    '@folio/myprofile' : {},
    '@folio/tenant-settings' : {},
    '@folio/users' : {},
    '@folio/data-import' : {},
    '@folio/requests': {},
    '@folio/developer': {},
    '@folio/servicepoints': {},
    '@folio/stripes-inventory-components' : {},
    '@folio/stripes-marc-components' : {},
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
