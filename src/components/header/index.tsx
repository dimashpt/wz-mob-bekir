import React, { forwardRef, ReactNode, useEffect } from 'react';
import { BackHandler, StyleProp, View, ViewStyle } from 'react-native';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

const headerVariants = tv({
  base: 'rounded-b-xl bg-surface z-1',
  variants: {
    type: {
      default: 'bg-surface shadow-sm',
      transparent: 'bg-transparent shadow-none',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

interface HeaderProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentContainerClassName?: string;
  hideBack?: boolean;
  title?: string;
  onPressBack?: () => void;
  rightContent?: ReactNode;
  className?: string;
  type?: 'default' | 'transparent';
}

/**
 * @typedef {Object} HeaderProps
 * @property {StyleProp<ViewStyle>} [style] - Custom Content to display in the header
 * @property {StyleProp<ViewStyle>} [contentContainerStyle] - Custom Content to display in the header
 * @property {ReactNode} [children] - Custom Content to display in the header
 * @property {boolean} [hideBack=false] - Whether to hide the back button
 * @property {string} [title] - The title to display in the header
 * @property {() => void} [onPressBack] - Custom function to call when back button is pressed
 * @property {ReactNode} [rightContent] - Content to display on the right side of the header
 */

/**
 * Header component for navigation and title display
 * @param {HeaderProps} props
 */
export const Header = forwardRef<View, HeaderProps>(
  (
    {
      children,
      contentContainerStyle,
      contentContainerClassName,
      hideBack = false,
      title,
      onPressBack,
      rightContent,
      className,
      style,
      type = 'default',
    },
    ref,
  ) => {
    const { back } = useRouter();
    const insets = useSafeAreaInsets();

    function handleBackPress(): boolean {
      if (onPressBack) {
        onPressBack();
        return true;
      } else {
        back();
        return true;
      }
    }

    useEffect(() => {
      const backHandlerSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => {
        backHandlerSubscription.remove();
      };
    }, [handleBackPress]);

    return (
      <View
        ref={ref}
        className={twMerge(headerVariants({ type }), className)}
        style={[{ paddingTop: insets.top }, style]}
      >
        <View
          className={twMerge(
            'py-sm px-lg relative min-h-[48px] flex-row items-center justify-between',
            contentContainerClassName,
          )}
          style={contentContainerStyle}
        >
          {!hideBack && (
            <Clickable
              className="h-6 w-6 items-center justify-center"
              onPress={handleBackPress}
            >
              <Icon
                name="arrow"
                size={24}
                className={
                  type === 'transparent' ? 'text-white' : 'text-foreground'
                }
                transform={[{ rotate: '90deg' }]}
              />
            </Clickable>
          )}
          <View className="absolute top-0 right-0 bottom-0 left-0 items-center justify-center">
            {title && (
              <Text
                variant="labelXL"
                numberOfLines={1}
                className={
                  type === 'transparent' ? 'text-white' : 'text-foreground'
                }
              >
                {title}
              </Text>
            )}
          </View>
          {rightContent && <View>{rightContent}</View>}
        </View>
        {children && <View className="w-full">{children}</View>}
      </View>
    );
  },
);
