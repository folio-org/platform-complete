module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false
  },
  modules: {
    '@folio/agreements' : {},
    '@folio/bulk-edit': {},
    '@folio/courses' : {},
    '@folio/data-import' : {},
    '@folio/data-export' : {},
    '@folio/dashboard' : {},
    '@folio/eholdings' : {},
    '@folio/export-manager': {},
    '@folio/handler-stripes-registry': {},
    '@folio/inventory' : {},
    '@folio/invoice' : {},
    '@folio/licenses' : {},
    '@folio/myprofile' : {},
    '@folio/notes' : {},
    '@folio/orders' : {},
    '@folio/plugin-create-inventory-records' : {},
    '@folio/plugin-find-agreement' : {},
    '@folio/plugin-find-authority' : {},
    '@folio/plugin-find-import-profile' : {},
    '@folio/plugin-find-instance' : {},
    '@folio/plugin-find-interface' : {},
    '@folio/plugin-find-license' : {},
    '@folio/plugin-find-organization' : {},
    '@folio/plugin-find-package-title': {},
    '@folio/plugin-find-user' : {},
    '@folio/quick-marc' : {},
    '@folio/marc-authorities': {},
    '@folio/stripes-authority-components' : {},
    '@folio/stripes-erm-components' : {},
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
      src: './tenant-assets/opentown-libraries-favicon.png',
    },
  }
};
