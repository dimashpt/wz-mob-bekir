import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { presets: ['babel-preset-expo'] },
    ],
  },
  transformIgnorePatterns: [
    // Don't transform these modules but allow them through
    'node_modules/(?!(react-native|expo|@expo|react-native-reanimated|@react-navigation|@react-buoy|react-native-gesture-handler|react-native-screens|react-native-tab-view|react-native-mmkv|react-native-safe-area-context|react-native-pager-view|react-native-reanimated|lottie-react-native|@react-native-async-storage|react-native-svg|expo-constants|expo-font|expo-blur|expo-image|expo-linear-gradient|expo-linking|expo-notifications|expo-status-bar|expo-system-ui|expo-device|expo-application|expo-clipboard|expo-crypto|expo-haptics|expo-in-app-updates|expo-insights|expo-screen-orientation|expo-secure-store|expo-splash-screen|expo-updates|react-hook-form|zod|zustand|dayjs|tailwindcss|tailwind-merge|tailwind-variants|uniwind|i18next|react-i18next|axios|@sentry|lottie-react-native|react-native-exception-handler|react-native-keyboard-controller|react-native-nitro-modules|react-native-worklets)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).(ts|tsx|js|jsx)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/.expo/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  globals: {
    __DEV__: true,
  },
  haste: {
    defaultPlatform: 'ios',
    platforms: ['android', 'ios'],
  },
};

export default config;
