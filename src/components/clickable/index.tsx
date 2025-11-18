import React, { useState } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ClickableProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  enableHaptic?: boolean;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

export const Clickable: React.FC<ClickableProps> = ({
  children,
  onPress,
  disabled = false,
  enableHaptic = false,
  style,
  ...props
}) => {
  // Animation shared values
  const [isPressing, setIsPressing] = useState(false);

  // Press handlers
  function handlePressIn(): void {
    if (disabled || !onPress) return;

    setIsPressing(true);

    // Haptic feedback
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function handlePressOut(): void {
    if (disabled || !onPress) return;

    setIsPressing(false);
  }

  function handlePress(): void {
    if (disabled || !onPress) return;

    // Haptic feedback for successful press
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onPress();
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...props}
      style={[
        {
          transitionProperty: ['transform', 'opacity'],
          transitionDuration: [100, 100],
          transform: [{ scale: isPressing ? 0.99 : 1 }],
          opacity: isPressing ? 0.8 : 1,
        },
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
};
