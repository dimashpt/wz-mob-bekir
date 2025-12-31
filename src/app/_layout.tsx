import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import * as Fonts from '@expo-google-fonts/plus-jakarta-sans';
import { Stack, useNavigationContainerRef, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';

import { UpdateButton } from '@/components';

import '@/lib/i18n'; // Import i18n configuration
import '../theme/global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';
import { QueryClientProvider } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { HeroUINativeProvider } from 'heroui-native';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind, useCSSVariable } from 'uniwind';

import { DevTools, InAppUpdateDialog, SnackbarProvider } from '@/components';
import { SplashScreen as SplashScreenComponent } from '@/components/splash';
import { useTheme } from '@/hooks';
import { initExceptionHandler } from '@/lib/exception-handler';
import { queryClient } from '@/lib/react-query';
import { navigationIntegration, Sentry } from '@/lib/sentry';
import { useAppStore, useAuthStore } from '@/store';
import { logger } from '@/utils/logger';

// Initialize Exception Handler
initExceptionHandler();

// Prevent auto hide splash screen
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const { useFonts, __metadata__, ...fonts } = Fonts;

function App(): React.ReactNode {
  const {
    initializeLanguage,
    theme: appColorScheme,
    showBetaFeatures,
    hasCompletedOnboarding,
  } = useAppStore();
  const { status } = useAuthStore();
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef();
  const [fontsLoaded] = useFonts(fonts);

  const [splashFinished, setSplashFinished] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);

  const { resetStatusBarStyle } = useTheme();
  const path = usePathname();
  const backgroundColor = useCSSVariable('--color-background') as string;

  useEffect(() => {
    /**
     * NOTE: Reset status bar style when path changes
     * This is to ensure that the status bar style is reset when the user navigates to a new screen
     */
    resetStatusBarStyle();
  }, [path]);

  useTanStackQueryDevTools(queryClient);

  useEffect(() => {
    initializeLanguage();

    function handleDeepLink(event: { url: string }): void {
      const url = Linking.parse(event.url);
      logger.log('Deep link:', url);
      // Expo Router will handle navigation automatically
    }

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle initial URL when app is closed
    Linking.getInitialURL().then((url) => {
      if (url) {
        const parsed = Linking.parse(url);
        logger.log('Initial URL:', parsed);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Uniwind.setTheme(appColorScheme);
    setStatusBarStyle(
      appColorScheme === 'system'
        ? 'auto'
        : appColorScheme === 'light'
          ? 'dark'
          : 'light',
    );
  }, [appColorScheme, colorScheme, showBetaFeatures]);

  useEffect(() => {
    if (navigationRef && navigationIntegration) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle splash screen animation finish with fade transition
  const handleSplashAnimationFinish = (): void => {
    setSplashFinished(true);
    setShowMainApp(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <SafeAreaListener
          onChange={({ insets }) => Uniwind.updateInsets(insets)}
          style={{ backgroundColor }}
        >
          <KeyboardProvider>
            <HeroUINativeProvider>
              <BottomSheetModalProvider>
                <StatusBar
                  style={appColorScheme === 'dark' ? 'light' : 'dark'}
                />
                <DevTools />
                <SnackbarProvider>
                  {/* Splash Screen */}
                  <Animated.View
                    className="absolute inset-0 z-1000"
                    style={{
                      transitionProperty: 'opacity',
                      transitionDuration: '300ms',
                      transitionTimingFunction: 'ease-out',
                      opacity: splashFinished ? 0 : 1,
                    }}
                    pointerEvents={splashFinished ? 'none' : 'auto'}
                  >
                    <SplashScreenComponent
                      key="splashScreen"
                      onAnimationFinish={handleSplashAnimationFinish}
                    />
                  </Animated.View>

                  {/* Main App */}
                  {showMainApp && (
                    <Animated.View
                      className="flex-1"
                      style={{
                        transitionProperty: 'opacity',
                        transitionDuration: '300ms',
                        transitionTimingFunction: 'ease-in',
                        opacity: splashFinished ? 1 : 0,
                      }}
                    >
                      <Stack>
                        <Stack.Protected
                          guard={
                            status === 'loggedOut' && !hasCompletedOnboarding
                          }
                        >
                          <Stack.Screen
                            name="index"
                            options={{ headerShown: false }}
                          />
                        </Stack.Protected>
                        <Stack.Protected
                          guard={
                            (status === 'loggedOut' ||
                              status === 'firstLogin') &&
                            hasCompletedOnboarding
                          }
                        >
                          <Stack.Screen
                            name="(auth)"
                            options={{
                              headerShown: false,
                              contentStyle: { backgroundColor },
                            }}
                          />
                        </Stack.Protected>
                        <Stack.Protected guard={status === 'loggedIn'}>
                          <Stack.Screen
                            name="(tabs)"
                            options={{
                              headerShown: false,
                              contentStyle: { backgroundColor },
                            }}
                          />
                          <Stack.Screen
                            name="(protected)"
                            options={{
                              headerShown: false,
                              contentStyle: { backgroundColor },
                            }}
                          />
                        </Stack.Protected>
                      </Stack>
                      <UpdateButton />
                      <InAppUpdateDialog />
                    </Animated.View>
                  )}
                </SnackbarProvider>
              </BottomSheetModalProvider>
            </HeroUINativeProvider>
          </KeyboardProvider>
        </SafeAreaListener>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

/**
 * In development, do not wrap with Sentry to enable hot reloading due to a NativeWind issue.
 * See: https://github.com/nativewind/nativewind/issues/1505
 */
const RootLayout = __DEV__ ? App : Sentry.wrap(App);

export default RootLayout;
