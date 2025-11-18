import { ColorSchemeName, Dimensions, useColorScheme } from 'react-native';

import { setStatusBarStyle } from 'expo-status-bar';

import { useAppStore } from '@/store';

export const { width: screenWidth, height: screenHeight } =
  Dimensions.get('window');

export function useTheme(): {
  activeColorScheme: ColorSchemeName;
  resetStatusBarStyle: () => void;
} {
  const { theme: appColorScheme } = useAppStore();
  const systemColorScheme = useColorScheme();

  function resetStatusBarStyle(): void {
    setStatusBarStyle(
      appColorScheme === 'system'
        ? 'auto'
        : appColorScheme === 'light'
          ? 'dark'
          : 'light',
    );
  }

  return {
    activeColorScheme:
      appColorScheme === 'system' ? systemColorScheme : appColorScheme,
    resetStatusBarStyle,
  };
}
