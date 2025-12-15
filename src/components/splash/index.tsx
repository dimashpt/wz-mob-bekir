import React from 'react';

import { setStatusBarStyle } from 'expo-status-bar';
import RNLottieView from 'lottie-react-native';
import { withUniwind } from 'uniwind';

import splashAnimation from '@/assets/animations/splash.json';
import { useOnMount, useTheme } from '@/hooks';

const LottieView = withUniwind(RNLottieView);

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

export function SplashScreen({
  onAnimationFinish,
}: SplashScreenProps): React.ReactNode {
  const { activeColorScheme } = useTheme();

  function onLottieAnimationFinish(): void {
    onAnimationFinish();
  }

  useOnMount(() => {
    setStatusBarStyle(activeColorScheme === 'light' ? 'dark' : 'light');
  });

  return (
    <LottieView
      source={splashAnimation}
      autoPlay
      loop={false}
      onAnimationFinish={onLottieAnimationFinish}
      className="bg-background flex-1"
      resizeMode="contain"
    />
  );
}
