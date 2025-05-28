// const platformCore = require('@folio/platform-core/stripes.config.js');
// const platformERM = require('@folio/platform-erm/stripes.config.js');
// const { merge } = require('lodash');

module.exports = {
  okapi: {
    authnUrl: "https://folio-edev-spitfire-keycloak.ci.folio.org",
    uiUrl: "https://folio-edev-spitfire-diku.ci.folio.org",
    url: "https://ecs-folio-edev-spitfire-kong.ci.folio.org",
  },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    preserveConsole: true,
    useSecureTokens: true,
    tenantOptions: {
      consortium: { name: 'consortium', clientId: 'consortium-application' },
      college: { name: 'college', clientId: 'college-application' },
    },
  },

  modules: {
    '@folio/data-import' : {},
    '@folio/data-export' : {},
    '@folio/developer' : {},
    '@folio/eholdings' : {},
    '@folio/export-manager': {},
    '@folio/handler-stripes-registry': {},
    '@folio/inventory' : {},
    '@folio/ldp': {},
    '@folio/marc-authorities': {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/plugin-create-inventory-records' : {},
    '@folio/plugin-find-agreement': {},
    '@folio/plugin-find-authority' : {},
    '@folio/plugin-find-instance' : {},
    '@folio/plugin-find-package-title': {},
    '@folio/plugin-find-po-line': {},
    '@folio/plugin-find-user' : {},
    '@folio/quick-marc': {},
    '@folio/stripes-authority-components' : {},
    '@folio/stripes-inventory-components' : {},
    '@folio/stripes-marc-components' : {},
    '@folio/tags': {},
    '@folio/tenant-settings' : {},
    '@folio/users' : {},
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
