module.exports = {
  okapi: {
    'url': '${kongUrl}',
    'uiUrl': '${tenantUrl}',
    'authnUrl': '${keycloakUrl}'
  },
  config: {
    hasAllPerms: ${hasAllPerms},
    useSecureTokens: true,
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    isSingleTenant: ${isSingleTenant},
    isEureka: true,
    tenantOptions: ${tenantOptions},
    enableEcsRequests: ${enableEcsRequests},
    rtr: {
      idleSessionTTL: '1h',
      idleModalTTL: '30s',
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
    '@folio/stripes-erm-components' : {},
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
      alt: 'Opentown Libraries'
    },
    favicon: {
      src: './tenant-assets/folio-favicon.png'
    },
  }
};
