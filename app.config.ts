import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config: defaultConfig }: ConfigContext): ExpoConfig => {
  const VARIANT = process.env.APP_VARIANT;
  const VERSION = '0.1.0';
  const BUILD_NUMBER = 1;
  const BUNDLE_ID = 'com.bebaschat.app';
  const EXPO_PROJECT_ID = 'cf27c8f8-5c74-4302-9386-a44ed0d781ad';

  const config: ExpoConfig = {
    ...defaultConfig,
    name: 'Bebaschat',
    slug: 'bebaschat',
    owner: 'wz-technology',
    version: VERSION,
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'bebaschat',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    experiments: {
      reactCompiler: false,
      typedRoutes: true,
    },
    extra: {
      router: { origin: false },
      eas: { projectId: EXPO_PROJECT_ID },
    },
    updates: { url: `https://u.expo.dev/${EXPO_PROJECT_ID}` },
    runtimeVersion: { policy: 'appVersion' },
    ios: {
      ...defaultConfig.ios,
      bundleIdentifier: BUNDLE_ID,
      supportsTablet: true,
      buildNumber: BUILD_NUMBER.toString(),
      // Add associatedDomains for Universal Links
      associatedDomains: ['applinks:dashboard.bebaschat.com'],
      icon: './src/assets/images/icon-ios.icon',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        AppStoreID: '',
        AppStoreCountry: 'id',
      },
    },
    android: {
      ...defaultConfig.android,
      package: BUNDLE_ID,
      versionCode: BUILD_NUMBER,
      edgeToEdgeEnabled: true,
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
              host: 'dashboard.bebaschat.com',
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
          project: 'bebaschat',
          organization: 'wz-technology',
        },
      ],
    ],
  };

  if (VARIANT === 'dev') {
    config.name = 'Bebaschat Dev';
    config.ios!.bundleIdentifier = `${BUNDLE_ID}.dev`;
    config.android!.package = `${BUNDLE_ID}.dev`;

    config.ios!.icon = './src/assets/images/icon-ios-dev.icon';
    config.android!.adaptiveIcon!.foregroundImage =
      './src/assets/images/icon-android-dev.png';
  } else if (VARIANT === 'preview') {
    config.name = 'Bebaschat Preview';
    config.ios!.bundleIdentifier = `${BUNDLE_ID}.preview`;
    config.android!.package = `${BUNDLE_ID}.preview`;
  }

  return config;
};
