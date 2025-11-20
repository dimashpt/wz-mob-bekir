'use no memo';

import React, {
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

export type FloatingActionButton = {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: React.JSX.Element;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  position?: { bottom?: number; right?: number; top?: number; left?: number };
  label?: string;
  scrollThreshold?: number;
  hideOffset?: number;
  hidden?: boolean;
  ref?: Ref<FloatingActionButton>;
}

export function FloatingActionButton({
  onPress,
  icon,
  disabled = false,
  style,
  position,
  label,
  ref,
  hidden = false,
}: FloatingActionButtonProps): React.ReactNode {
  const { bottom } = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;

  // Position defaults (bottom-right)
  const positionStyle = {
    bottom: position?.bottom ?? bottom + spacingLg,
    right: position?.right ?? spacingLg,
    top: position?.top,
    left: position?.left,
  };

  const lastScrollY = useRef(0);
  const fabOpacity = useSharedValue(1);
  const fabTranslateY = useSharedValue(0);
  const fabScale = useSharedValue(0);
  const fabRotation = useSharedValue(0);
  const [shouldRender, setShouldRender] = useState(!hidden);

  useImperativeHandle(ref, () => ({ onScroll }));

  useEffect(() => {
    if (!hidden) {
      setShouldRender(true);
      fabScale.value = withTiming(1, { duration: 300 });
      if (!label) {
        fabRotation.value = withTiming(360, { duration: 300 });
      }
    } else {
      fabScale.value = withTiming(0, { duration: 300 });
      if (!label) {
        fabRotation.value = withTiming(-360, { duration: 300 });
      }

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [hidden, label]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const scrollThreshold = 50;
    const hideOffset = 5;
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    if (scrollDiff > hideOffset && currentScrollY > scrollThreshold) {
      fabOpacity.value = withTiming(0, { duration: 200 });
      fabTranslateY.value = withTiming(100, { duration: 200 });
    }

    if (scrollDiff < -hideOffset || currentScrollY <= scrollThreshold) {
      fabOpacity.value = withTiming(1, { duration: 200 });
      fabTranslateY.value = withTiming(0, { duration: 200 });
    }

    lastScrollY.current = currentScrollY;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
    transform: [
      { translateY: fabTranslateY.value },
      { scale: fabScale.value },
      { rotate: `${fabRotation.value}deg` },
    ],
  }));

  if (!shouldRender) return null;

  return (
    <Clickable
      onPress={onPress}
      disabled={disabled}
      className={twMerge(
        'z-fixed p-lg bg-accent absolute flex-row items-center justify-center rounded-full shadow-md',
        disabled && 'bg-muted',
        label && 'gap-sm',
      )}
      style={[animatedStyle, positionStyle, style]}
      enableHaptic
    >
      {icon ?? (
        <Icon name="plus" size="2xl" className="text-foreground-inverted" />
      )}
      {label ? (
        <Text variant="labelS" color="light">
          {label}
        </Text>
      ) : null}
    </Clickable>
  );
}
