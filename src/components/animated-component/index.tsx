import React from 'react';
import { ViewProps } from 'react-native';

import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

interface ProductItemProps extends ViewProps {
  index?: number;
  children: React.ReactNode;
  duration?: number;
}

export function AnimatedComponent({
  children,
  index = 0,
  duration = 50,
  ...props
}: ProductItemProps): React.JSX.Element {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * duration).springify()}
      exiting={FadeOutUp.springify()}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
