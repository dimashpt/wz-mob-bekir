import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Text } from '@/components/text';

export interface DialogRef {
  open: () => void;
  close: () => void;
}

export interface DialogProps {
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
  containerClassName?: string;
  contentClassName?: string;
  position?: 'top' | 'middle' | 'bottom';
  ref?: React.Ref<DialogRef>;
}

const dialogRoot = tv({
  base: 'px-lg flex-1 items-center',
  variants: {
    position: {
      top: 'justify-start',
      middle: 'justify-center',
      bottom: 'justify-end',
    },
  },
  defaultVariants: {
    position: 'middle',
  },
});

const dialogContainer = tv({
  base: 'bg-surface p-lg w-full rounded-lg',
});

export function Dialog({
  title,
  children,
  onClose,
  dismissible = true,
  containerClassName,
  contentClassName,
  position = 'middle',
  ref,
}: DialogProps): React.JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);
  const backdropOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const keyboardOffset = useSharedValue(0);
  const { top, bottom } = useSafeAreaInsets();
  const baseVerticalSpacing = 16;

  function closeDialog(): void {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    contentOpacity.value = withTiming(0, { duration: 200 });

    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  }

  function handleRequestClose(): void {
    if (!dismissible) {
      return;
    }

    Keyboard.dismiss();

    closeDialog();
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 200 });
      contentOpacity.value = withTiming(1, { duration: 200 });
    },
    close: closeDialog,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const rootStyle = useAnimatedStyle(() => ({
    paddingTop: top + baseVerticalSpacing,
    paddingBottom: bottom + baseVerticalSpacing + keyboardOffset.value,
  }));

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', (event) => {
      keyboardOffset.value = withTiming(event.endCoordinates.height, {
        duration: 150,
      });
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      keyboardOffset.value = withTiming(0, { duration: 150 });
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [keyboardOffset]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <Animated.View
        className={twMerge(dialogRoot({ position }))}
        style={rootStyle}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, backdropStyle]}
          pointerEvents="box-none"
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 30 : 20}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
          {dismissible && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleRequestClose}
            />
          )}
        </Animated.View>
        <Animated.View
          className={twMerge(dialogContainer(), containerClassName)}
          style={contentStyle}
        >
          {title ? (
            <Text variant="headingXS" className="mb-sm">
              {title}
            </Text>
          ) : null}
          <View className={contentClassName}>{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
