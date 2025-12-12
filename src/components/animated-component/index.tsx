import React from 'react';
import { ViewProps } from 'react-native';

import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

interface ProductItemProps extends ViewProps {
  index?: number;
  children: React.ReactNode;
  duration?: number;
  disableExitAnimation?: boolean;
}

export function AnimatedComponent({
  children,
  index = 0,
  duration = 50,
  disableExitAnimation = false,
  ...props
}: ProductItemProps): React.JSX.Element {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * duration).springify()}
      exiting={disableExitAnimation ? undefined : FadeOutUp.springify()}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
