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
    }
  },
  modules: {
    '@folio/agreements' : {},
    '@folio/bulk-edit': {},
    '@folio/circulation' : {},
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
    '@folio/plugin-find-organization' : {},
    '@folio/plugin-find-package-title': {},
    '@folio/plugin-find-po-line': {},
    '@folio/plugin-find-user' : {},
    '@folio/plugin-query-builder' : {},
    '@folio/quick-marc' : {},
    '@folio/marc-authorities': {},
    '@folio/receiving' : {},
    '@folio/requests' : {},
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
      alt: 'Opentown Libraries'
    },
    favicon: {
      src: './tenant-assets/folio-favicon.png'
    },
  }
};
