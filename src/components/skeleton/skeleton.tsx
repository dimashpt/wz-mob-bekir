import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, ViewStyle } from 'react-native';

import { twMerge } from 'tailwind-merge';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  animationSpeed?: number; // Duration in milliseconds
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
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
      className={twMerge('bg-muted overflow-hidden', className)}
      style={[
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}
