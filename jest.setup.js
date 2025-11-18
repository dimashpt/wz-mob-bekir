/* eslint-disable no-console */
// Jest setup file for React Native
import { afterAll, beforeAll, jest } from '@jest/globals';

import '@testing-library/jest-native/extend-expect';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {},
  },
  manifest: {
    extra: {},
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
  FontResource: jest.fn(),
}));

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: jest.fn((_fn) => ({})),
  useAnimatedProps: jest.fn((_fn) => ({})),
  useSharedValue: jest.fn((v) => ({
    value: v,
  })),
  withTiming: jest.fn((v) => v),
  withSequence: jest.fn((...args) => args[args.length - 1]),
  runOnJS: jest.fn((fn) => fn),
  Easing: {
    linear: jest.fn((v) => v),
    out: jest.fn((v) => v),
    in: jest.fn((v) => v),
    inOut: jest.fn((v) => v),
    cubic: jest.fn((v) => v),
    quad: jest.fn((v) => v),
  },
  createAnimatedComponent: jest.fn((Component) => Component),
  Text: jest.fn(({ children }) => children),
  View: jest.fn(({ children }) => children),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: jest.fn(() => ({
      onUpdate: jest.fn(function () {
        return this;
      }),
      onEnd: jest.fn(function () {
        return this;
      }),
      enabled: jest.fn(function () {
        return this;
      }),
    })),
  },
  GestureDetector: ({ children }) => children,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Circle: 'Circle',
  Svg: 'Svg',
}));

// Mock uniwind
jest.mock('uniwind', () => ({
  useCSSVariable: jest.fn((_varName) => '#ffffff'),
  withUniwind: jest.fn((Component) => Component),
}));

// Mock react-native StyleSheet to avoid native module issues
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn((styles) => styles),
  flatten: jest.fn((style) => style),
}));

// Mock bottom-sheet to avoid native module dependencies
jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModal: ({ children }) => children,
  BottomSheetView: ({ children }) => children,
  useBottomSheetInternal: jest.fn(() => ({
    animatedIndex: { value: 0 },
  })),
}));

// Mock Dimensions to avoid native module issues
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  default: {
    get: jest.fn(() => ({
      width: 375,
      height: 812,
    })),
  },
}));

// Suppress console errors and warnings in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Non-serializable values were found') ||
        args[0].includes('MappedError'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
