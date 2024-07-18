const modules = require("./stripes.modules");

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
    rtr: {
      idleSessionTTL: '1h',
      idleModalTTL: '30s',
    }
  },
  modules,
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
