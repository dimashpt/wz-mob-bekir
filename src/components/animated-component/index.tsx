import React from 'react';

import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

interface ProductItemProps {
  index?: number;
  children: React.ReactNode;
}

export function AnimatedComponent({
  children,
  index = 0,
}: ProductItemProps): React.JSX.Element {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      exiting={FadeOutUp.springify()}
    >
      {children}
    </Animated.View>
  );
}
