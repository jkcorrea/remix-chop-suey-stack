const { flatRoutes } = require('remix-flat-routes')

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  serverDependenciesToBundle: ['lodash-es'],
  // ignore all files in routes folder to prevent default remix convention from picking up routes:
  // https://github.com/kiliman/remix-flat-routes#%EF%B8%8F-configuration
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => flatRoutes('routes', defineRoutes),
  future: {
    v2_errorBoundary: true,
  },
}
