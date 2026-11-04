const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require('expo/metro-config');

const sentryConfig = getSentryExpoConfig(__dirname);
const defaultConfig = getDefaultConfig(__dirname);

// Merge Sentry config with SVG transformer settings
const config = {
  ...defaultConfig,
  ...sentryConfig,
  transformer: {
    ...defaultConfig.transformer,
    ...sentryConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  },
  resolver: {
    ...defaultConfig.resolver,
    ...sentryConfig.resolver,
    assetExts: [...new Set([...defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), 'wasm'])],
    sourceExts: [...new Set([...(defaultConfig.resolver.sourceExts || []), 'svg'])],
  },
};

// SQLite's web worker requires SharedArrayBuffer in a cross-origin isolated page.
// Preserve Sentry/Expo middleware while applying the required development headers.
const enhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, metroServer) => {
    const enhancedMiddleware = enhanceMiddleware
      ? enhanceMiddleware(middleware, metroServer)
      : middleware;
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      return enhancedMiddleware(req, res, next);
    };
  },
};

module.exports = config;
