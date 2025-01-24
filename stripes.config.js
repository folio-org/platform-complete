// const platformCore = require('@folio/platform-core/stripes.config.js');
// const platformERM = require('@folio/platform-erm/stripes.config.js');
// const { merge } = require('lodash');

module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    preserveConsole: true,
    useSecureTokens: true,
  },

  modules: {
    '@folio/agreements' : {},
    '@folio/bulk-edit': {},
    '@folio/checkin' : {},
    '@folio/checkout' : {},
    '@folio/circulation' : {},
    '@folio/circulation-log' : {},
    '@folio/claims' : {},
    '@folio/courses' : {},
    '@folio/data-import' : {},
    '@folio/data-export' : {},
    '@folio/dashboard' : {},
    '@folio/developer' : {},
    '@folio/eholdings' : {},
    '@folio/erm-comparisons': {},
    '@folio/erm-usage' : {},
    '@folio/export-manager': {},
    '@folio/handler-stripes-registry': {},
    "@folio/gobi-settings": {},
    '@folio/inn-reach' : {},
    '@folio/inventory' : {},
    '@folio/invoice' : {},
    '@folio/finance' : {},
    '@folio/ldp' : {},
    '@folio/licenses' : {},
    '@folio/local-kb-admin': {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/oa' : {},
    '@folio/oai-pmh' : {},
    '@folio/orders' : {},
    '@folio/organizations' : {},
    '@folio/plugin-create-inventory-records' : {},
    '@folio/plugin-find-agreement' : {},
    '@folio/plugin-find-authority' : {},
    '@folio/plugin-find-erm-usage-data-provider' : {},
    '@folio/plugin-find-fund' : {},
    '@folio/plugin-eusage-reports': {},
    '@folio/plugin-find-import-profile' : {},
    '@folio/plugin-find-instance' : {},
    '@folio/plugin-find-contact' : {},
    '@folio/plugin-find-eresource': {},
    '@folio/plugin-find-interface' : {},
    '@folio/plugin-find-license' : {},
    '@folio/plugin-find-organization' : {},
    '@folio/plugin-find-package-title': {},
    '@folio/plugin-find-po-line': {},
    '@folio/plugin-find-user' : {},
    '@folio/plugin-query-builder' : {},
    '@folio/quick-marc' : {},
    '@folio/marc-authorities': {},
    '@folio/reading-room' : {},
    '@folio/receiving' : {},
    '@folio/remote-storage' : {},
    '@folio/requests' : {},
    '@folio/requests-mediated' : {},
    '@folio/serials-management': {},
    '@folio/service-interaction': {},
    '@folio/servicepoints' : {},
    '@folio/stripes-authority-components' : {},
    '@folio/stripes-erm-components' : {},
    '@folio/stripes-inventory-components' : {},
    '@folio/stripes-marc-components' : {},
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
