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
    // user-visible apps
    '@folio/agreements' : {},
    '@folio/bulk-edit': {},
    '@folio/checkin' : {},
    '@folio/checkout' : {},
    '@folio/circulation-log' : {},
    '@folio/claims' : {},
    '@folio/courses' : {},
    '@folio/dashboard' : {},
    '@folio/data-export' : {},
    '@folio/data-import' : {},
    '@folio/eholdings' : {},
    '@folio/erm-comparisons': {},
    '@folio/erm-usage' : {},
    '@folio/export-manager': {},
    '@folio/finance' : {},
    '@folio/inn-reach' : {},
    '@folio/inventory' : {},
    '@folio/invoice' : {},
    '@folio/licenses' : {},
    '@folio/lists' : {},
    '@folio/local-kb-admin': {},
    '@folio/marc-authorities': {},
    '@folio/requests-mediated' : {},
    '@folio/oa' : {},
    '@folio/orders' : {},
    '@folio/organizations' : {},
    '@folio/reading-room' : {},
    '@folio/receiving' : {},
    '@folio/remote-storage' : {},
    '@folio/ldp' : {},
    '@folio/requests' : {},
    '@folio/serials-management': {},
    '@folio/users' : {},

    // settings-only apps, plugins, etc
    // always listed alphabetically, if at all
    '@folio/acquisition-units': {},
    '@folio/calendar' : {},
    '@folio/circulation' : {},
    '@folio/developer' : {},
    '@folio/handler-stripes-registry': {},
    "@folio/gobi-settings": {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/oai-pmh' : {},
    '@folio/plugin-bursar-export': {},
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
    '@folio/service-interaction': {},
    '@folio/servicepoints' : {},
    '@folio/stripes-authority-components' : {},
    '@folio/stripes-erm-components' : {},
    '@folio/stripes-inventory-components' : {},
    '@folio/stripes-marc-components' : {},
    '@folio/tags' : {},
    '@folio/tenant-settings' : {},
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
