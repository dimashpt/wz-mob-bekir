import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config: defaultConfig }: ConfigContext): ExpoConfig => {
  const APP_NAME = 'Bebaskirim';
  const APP_VARIANT = process.env.APP_VARIANT;
  const APP_BUNDLE_ID = 'com.bebaskirim.dashboard';
  const APP_SCHEME = 'bebaskirim';
  const APP_VERSION = '0.1.0';
  const APP_BUILD_NUMBER = 1;
  const EXPO_SLUG = 'bebaskirim';
  const EXPO_PROJECT_ID = 'da7d7c28-ab2e-4d0f-a669-d5c99591b5b1';
  const EXPO_OWNER = 'wz-technology';

  const config: ExpoConfig = {
    ...defaultConfig,
    name: APP_NAME,
    slug: EXPO_SLUG,
    owner: EXPO_OWNER,
    version: APP_VERSION,
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: APP_SCHEME,
    userInterfaceStyle: 'automatic',
    experiments: {
      reactCompiler: false,
      typedRoutes: true,
    },
    extra: {
      router: { origin: false },
      eas: { projectId: EXPO_PROJECT_ID },
    },
    updates: {
      url: `https://u.expo.dev/${EXPO_PROJECT_ID}`,
    },
    runtimeVersion: { policy: 'appVersion' },
    ios: {
      ...defaultConfig.ios,
      bundleIdentifier: APP_BUNDLE_ID,
      supportsTablet: true,
      buildNumber: APP_BUILD_NUMBER.toString(),
      // Add associatedDomains for Universal Links
      associatedDomains: ['applinks:dashboard.bebaskirim.com'],
      icon: './src/assets/images/icon-ios.icon',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        AppStoreID: '',
        AppStoreCountry: 'id',
      },
    },
    android: {
      ...defaultConfig.android,
      package: APP_BUNDLE_ID,
      versionCode: APP_BUILD_NUMBER,
      adaptiveIcon: {
        foregroundImage: './src/assets/images/icon-android.png',
        monochromeImage: './src/assets/images/icon-android-monochrome.png',
        backgroundColor: '#ffffff',
      },
      permissions: [],
      // Add intentFilters for App Links
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'dashboard.bebaskirim.com',
              pathPrefix: '/auth/reset-password',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    plugins: [
      'expo-secure-store',
      [
        'expo-sqlite',
        {
          enableFTS: true,
          useSQLCipher: true,
          android: {
            enableFTS: false,
            useSQLCipher: false,
          },
          ios: {
            customBuildFlags: [
              '-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1',
            ],
          },
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            deploymentTarget: '15.5',
          },
          android: {
            minSdkVersion: 26,
          },
        },
      ],
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#F2F2F2',
          dark: {
            image: './src/assets/images/icon.png',
            backgroundColor: '#121212',
          },
        },
      ],
      'expo-font',
      [
        'expo-screen-orientation',
        {
          initialOrientation: 'PORTRAIT',
        },
      ],
      [
        'react-native-edge-to-edge',
        {
          android: {
            parentTheme: 'Default',
            enforceNavigationBarContrast: false,
          },
        },
      ],
      'expo-notifications',
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: process.env.SENTRY_PROJECT ?? '',
          organization: process.env.SENTRY_ORGANIZATION ?? '',
        },
      ],
      [
        'expo-document-picker',
        {
          iCloudContainerEnvironment: 'Production',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you share them with your friends.',
        },
      ],
      './scripts/rocketsim.ts',
    ],
  };

  if (APP_VARIANT === 'development') {
    config.name = `${APP_NAME} Dev`;
    config.ios!.bundleIdentifier = `${APP_BUNDLE_ID}.dev`;
    config.android!.package = `${APP_BUNDLE_ID}.dev`;

    config.ios!.icon = './src/assets/images/icon-ios-dev.icon';
    config.android!.adaptiveIcon!.foregroundImage =
      './src/assets/images/icon-android-dev.png';
  } else if (APP_VARIANT === 'preview') {
    config.name = `${APP_NAME} Preview`;
    config.ios!.bundleIdentifier = `${APP_BUNDLE_ID}.preview`;
    config.android!.package = `${APP_BUNDLE_ID}.preview`;
  }

  return config;
};
