const { withRozenite } = require('@rozenite/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withRozeniteExpoAtlasPlugin } = require('@rozenite/expo-atlas-plugin');
const { withUniwindConfig } = require('uniwind/metro');
const {
  withStorybook,
} = require('@storybook/react-native/metro/withStorybook');

const config = getSentryExpoConfig(__dirname);

/** @type {import('expo/metro-config').MetroConfig} */
const finalConfig = {
  ...config,
  transformer: {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    // Ensure `.svg` is not inserted in a way that overrides `.android.js`
    sourceExts: [...new Set([...config.resolver.sourceExts, 'svg'])],
  },
};

module.exports = withRozenite(
  withRozeniteExpoAtlasPlugin(
    withUniwindConfig(finalConfig, {
      /**
       * NOTE: The cssEntryFile and dtsFile are required for uniwind to work.
       * and must be placed in the root of the project, because uniwind will read
       * the cssEntryFile directory as a root directory. so if you change the location
       * of the cssEntryFile to somewhere else, somehow the uniwind will not work.
       *
       * But if you want to place the cssEntryFile somewhere else, you can use
       * the @source directive to tell uniwind where to find the root directory in the cssEntryFile.
       *
       * See more: https://github.com/Unistyles-OSS/uniwind/issues/133#issuecomment-3485215951
       */
      cssEntryFile: './src/theme/global.css',
      dtsFile: './src/@types/uniwind.d.ts',
      debug: true,
    }),
  ),
  { enabled: process.env.WITH_ROZENITE === 'true' },
);
