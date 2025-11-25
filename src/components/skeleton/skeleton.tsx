import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

import { twMerge } from 'tailwind-merge';

export interface SkeletonProps {
  style?: ViewStyle;
  animationSpeed?: number; // Duration in milliseconds
  className?: string;
}

export function Skeleton({
  style,
  animationSpeed = 1500,
  className,
}: SkeletonProps): React.ReactElement {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(
    function startPulseAnimation(): () => void {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: animationSpeed / 2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: animationSpeed / 2,
            useNativeDriver: true,
          }),
        ]),
      );

      pulseAnimation.start();

      return function stopAnimation(): void {
        pulseAnimation.stop();
      };
    },
    [pulseAnim, animationSpeed],
  );

  return (
    <Animated.View
      className={twMerge(
        'bg-muted h-5 w-full overflow-hidden rounded-md',
        className,
      )}
      style={[{ opacity: pulseAnim }, style]}
    />
  );
}
