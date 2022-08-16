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
    '@folio/licenses' : {},
    '@folio/inventory' : {},
    '@folio/quick-marc' : {},
    '@folio/data-import' : {},
    '@folio/tenant-settings' : {},
    '@folio/eholdings' : {},
    '@folio/myprofile' : {},
    '@folio/marc-authorities' : {},
    '@folio/notes' : {},
    '@folio/plugin-find-agreement' : {},
    '@folio/plugin-find-package-title': {},
    '@folio/plugin-find-authority': {},
    '@folio/plugin-find-user' : {},
    '@folio/plugin-find-organization' : {},
    '@folio/stripes-acq-components' : {},
    '@folio/stripes-erm-components' : {},
    '@folio/stripes-authority-components' : {},
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
