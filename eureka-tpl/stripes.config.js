const modules = require("./stripes.modules");

module.exports = {
  okapi: {
    'url': '${kongUrl}',
    'uiUrl': '${tenantUrl}',
    'tenant': '${tenantId}',
    'authnUrl': '${keycloakUrl}',
    'clientId': '${clientId}',
  },
  config: {
    hasAllPerms: ${hasAllPerms},
    useSecureTokens: true,
    idleSessionWarningSeconds: 60,
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    isSingleTenant: ${isSingleTenant},
    tenantOptions: ${tenantOptions}
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
