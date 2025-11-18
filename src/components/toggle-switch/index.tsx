import React from 'react';
import { Pressable } from 'react-native';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCSSVariable } from 'uniwind';

interface ToggleSwitchProps {
  /**
   * Current value of the toggle switch
   */
  value: boolean;
  /**
   * Callback function called when the toggle state changes
   */
  onValueChange: (value: boolean) => void;
  /**
   * Whether the toggle switch is disabled
   */
  disabled?: boolean;
  /**
   * Size of the toggle switch
   */
  size?: 'default' | 'small';
}

/**
 * Custom toggle switch component with smooth animations
 * Follows the app's design system and theme
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'default',
}) => {
  const bgColor = useCSSVariable('--color-background') as string;
  const primaryColor = useCSSVariable('--color-accent') as string;
  const whiteColor = useCSSVariable('--color-white') as string;
  const invertedPrimaryColor = useCSSVariable(
    '--color-foreground-inverted',
  ) as string;

  // Size configurations
  const sizeConfig = {
    default: { width: 48, height: 28, thumbSize: 20, movement: 20 },
    small: { width: 36, height: 21, thumbSize: 15, movement: 15 },
  };

  // Validate size and fallback to default if invalid
  const validatedSize = sizeConfig[size] ? size : 'default';
  const config = sizeConfig[validatedSize];

  // Animated value for the toggle state (0 = off, 1 = on)
  const toggleValue = useSharedValue(value ? 1 : 0);

  // Update animated value when prop changes
  React.useEffect(() => {
    toggleValue.value = withTiming(value ? 1 : 0, {
      duration: 200,
    });
  }, [value, toggleValue]);

  // Animated style for the track (background)
  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      toggleValue.value,
      [0, 1],
      [bgColor, primaryColor],
    );

    return {
      backgroundColor,
      opacity: disabled ? 0.5 : 1,
    };
  });

  // Animated style for the thumb (circle)
  const thumbStyle = useAnimatedStyle(() => {
    const translateX = toggleValue.value * config.movement;

    return {
      transform: [{ translateX }],
    };
  });

  function handlePress(): void {
    if (!disabled) {
      onValueChange(!value);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Animated.View
        style={[
          {
            width: config.width,
            height: config.height,
            borderRadius: config.height / 2,
            justifyContent: 'center',
            paddingHorizontal: validatedSize === 'small' ? 3 : 4,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: config.thumbSize,
              height: config.thumbSize,
              borderRadius: config.thumbSize / 2,
              backgroundColor: value ? invertedPrimaryColor : whiteColor,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};
