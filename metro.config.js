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
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...defaultConfig.resolver,
    ...sentryConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...new Set([...(defaultConfig.resolver.sourceExts || []), 'svg'])],
  },
};

module.exports = config;
