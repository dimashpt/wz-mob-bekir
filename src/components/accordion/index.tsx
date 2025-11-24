import React, { JSX, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';

const accordionVariants = tv({
  base: 'overflow-hidden',
  variants: {
    variant: {
      default: 'bg-surface rounded-md border border-border',
      bordered: 'bg-transparent border border-border rounded-md',
      shadow: 'bg-surface rounded-md shadow-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const headerVariants = tv({
  base: 'flex-row items-center justify-between px-md py-md',
  variants: {
    variant: {
      default: '',
      bordered: '',
      shadow: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AccordionProps {
  /**
   * Whether the accordion is expanded by default
   */
  defaultExpanded?: boolean;
  /**
   * Function to render custom title content
   */
  renderTitle?: () => React.ReactNode;
  /**
   * Content to display when expanded
   */
  children: React.ReactNode;
  /**
   * Custom styling for the accordion container
   */
  className?: string;
  /**
   * Custom style for the accordion container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Callback when expand state changes
   */
  onChange?: (expanded: boolean) => void;
  /**
   * Variant style for the accordion
   */
  variant?: 'default' | 'bordered' | 'shadow';
  /**
   * Whether the accordion is disabled
   */
  disabled?: boolean;
}

export function Accordion({
  defaultExpanded = false,
  renderTitle,
  children,
  className,
  style,
  onChange,
  variant = 'default',
  disabled = false,
}: AccordionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasMeasured, setHasMeasured] = useState(false);

  // Animation shared values
  const animatedHeight = useSharedValue(defaultExpanded ? 0 : 0);
  const chevronRotation = useSharedValue(defaultExpanded ? 180 : 0);
  const opacity = useSharedValue(defaultExpanded ? 1 : 0);

  // Update animations when expanded state changes
  useEffect(() => {
    if (!hasMeasured && contentHeight > 0) {
      // First measurement - set initial height if expanded
      if (isExpanded) {
        animatedHeight.value = contentHeight;
        opacity.value = 1;
      }
      setHasMeasured(true);
      return;
    }

    if (hasMeasured) {
      // Animate height
      animatedHeight.value = withTiming(isExpanded ? contentHeight : 0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      // Animate chevron rotation
      chevronRotation.value = withTiming(isExpanded ? 180 : 0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      // Animate opacity with slight delay for smoother transition
      opacity.value = withTiming(isExpanded ? 1 : 0, {
        duration: isExpanded ? 250 : 200,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [
    isExpanded,
    contentHeight,
    hasMeasured,
    animatedHeight,
    chevronRotation,
    opacity,
  ]);

  // Handle content layout measurement
  function handleContentLayout(event: LayoutChangeEvent): void {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      const newHeight = Math.ceil(height);
      if (newHeight !== contentHeight) {
        setContentHeight(newHeight);
        // If expanded and this is the first measurement, set initial height immediately
        if (isExpanded && !hasMeasured) {
          animatedHeight.value = newHeight;
          opacity.value = 1;
          setHasMeasured(true);
        }
      }
    }
  }

  // Toggle expanded state
  function handleToggle(): void {
    if (disabled) return;

    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onChange?.(newExpanded);
  }

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
      opacity: opacity.value,
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${chevronRotation.value}deg` }],
    };
  });

  const accordionClassName = twMerge(accordionVariants({ variant }), className);

  const headerClassName = twMerge(headerVariants({ variant }));

  return (
    <View className={accordionClassName} style={style}>
      <Clickable
        onPress={handleToggle}
        disabled={disabled}
        className={headerClassName}
      >
        <View className="flex-1 flex-row items-center">
          {renderTitle ? renderTitle() : null}
        </View>
        <Animated.View style={chevronAnimatedStyle}>
          <Icon name="chevron" size="lg" className="text-muted" />
        </Animated.View>
      </Clickable>
      {/* Hidden view to measure content height - always rendered off-screen */}
      <View
        onLayout={handleContentLayout}
        className="px-md pb-md"
        style={{
          position: 'absolute',
          opacity: 0,
          zIndex: -1,
          width: '100%',
        }}
        pointerEvents="none"
      >
        {children}
      </View>
      {/* Animated container that clips content based on height */}
      <Animated.View style={contentAnimatedStyle} className="overflow-hidden">
        <View className="px-md pb-md">{children}</View>
      </Animated.View>
    </View>
  );
}
