import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

/**
 * Loader Component
 *
 * A flexible loading component that can display any React component as an icon
 * with optional spinning animation. Provides consistent loading states across
 * the application with customizable styling and animation control.
 *
 * Features:
 * - Configurable spinning animation (enabled by default)
 * - Accepts any React component as icon (defaults to ActivityMonitor)
 * - Customizable container styling
 * - Smooth rotation animation with proper cleanup
 * - TypeScript support for better development experience
 */
interface LoaderProps {
  /** Spinning animation mode: true for clockwise, 'reverse' for counter-clockwise, false to disable. Defaults to false */
  spin?: boolean | 'reverse';
  /** React component to display as the loading icon. Defaults to ActivityMonitor */
  icon?: React.ReactElement;
  /** Custom style for the loader container */
  style?: StyleProp<ViewStyle>;
  /** Custom class name for the loader container */
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  spin = false,
  icon: IconComponent,
  style,
  className,
}) => {
  // Shared value for rotation animation
  const rotation = useSharedValue(0);

  // Start or stop animation based on spin prop
  React.useEffect(() => {
    if (spin) {
      // Start infinite rotation animation
      rotation.value = withRepeat(
        withTiming(spin === 'reverse' ? -360 : 360, {
          duration: 1000, // 1 second per rotation
        }),
        -1, // Infinite repeats
        false, // Don't reverse
      );
    } else {
      // Cancel animation and reset rotation
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 200 });
    }

    // Cleanup function to cancel animation on unmount
    return () => {
      cancelAnimation(rotation);
    };
  }, [spin, rotation]);

  // Animated style for rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View
      className={twMerge('items-center justify-center', className)}
      style={style}
    >
      <Animated.View style={spin ? animatedStyle : undefined}>
        {IconComponent ?? <ActivityIndicator size="small" />}
      </Animated.View>
    </View>
  );
};
