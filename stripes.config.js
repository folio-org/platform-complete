module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    showPerms: false
  },
  modules: {
    '@folio/acquisition-units': {},
    '@folio/agreements': {},
    '@folio/calendar' : {},
    '@folio/checkin' : {},
    '@folio/checkout' : {},
    '@folio/circulation' : {},
    '@folio/courses' : {},
    '@folio/data-export' : {},
    '@folio/data-import' : {},
    '@folio/developer' : {},
    '@folio/eholdings' : {},
    '@folio/erm-usage': {},
    '@folio/finance' : {},
    '@folio/inventory' : {},
    '@folio/invoice': {},
    '@folio/licenses': {},
    '@folio/local-kb-admin': {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/oai-pmh' : {},
    '@folio/orders': {},
    '@folio/organizations' : {},
    '@folio/plugin-find-agreement': {},
    '@folio/plugin-find-contact': {},
    '@folio/plugin-find-erm-usage-data-provider': {},
    '@folio/plugin-find-import-profile' : {},
    '@folio/plugin-find-instance' : {},
    '@folio/plugin-find-interface' : {},
    '@folio/plugin-find-license': {},
    '@folio/plugin-find-organization': {},
    '@folio/plugin-find-package-title': {},
    '@folio/plugin-find-po-line': {},
    '@folio/plugin-find-user' : {},
    '@folio/plugin-find-organization': {},
    '@folio/plugin-find-po-line': {},
    '@folio/quick-marc': {},
    '@folio/receiving' : {},
    '@folio/requests' : {},
    '@folio/search' : {},
    '@folio/servicepoints' : {},
    '@folio/stripes-data-transfer-components' : {},
    '@folio/stripes-erm-components': {},
    '@folio/tags': {},
    '@folio/tenant-settings' : {},
    '@folio/users' : {}
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
