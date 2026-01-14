import React, { ReactNode } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable } from '@/components/clickable';
import { Icon, IconNames, SvgIcons } from '@/components/icon';
import { Text } from '@/components/text';

export type HeaderRef = {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
} | null;

interface HeaderProps {
  ref?: React.RefObject<HeaderRef>;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPressBack?: () => void;
  title?: string;
  suffixIcon?: IconNames | ReactNode;
  onPressSuffix?: () => void;
  nativeProps?: NativeStackHeaderProps;
  renderTitle?: () => ReactNode;
}

const headerVariants = tv({
  base: 'border-b border-border bg-surface z-1 gap-sm',
  variants: {
    type: {
      default: 'bg-surface',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

/**
 * Header component for navigation and title display
 * @param {HeaderProps} props
 */
export function Header({
  ref: _ref,
  children,
  onPressBack,
  suffixIcon,
  onPressSuffix,
  className,
  style,
  title,
  nativeProps,
  renderTitle,
}: HeaderProps): React.JSX.Element {
  const { back } = useRouter();
  const insets = useSafeAreaInsets();

  function handleBackPress(): void {
    if (onPressBack) {
      onPressBack();
      return;
    }

    back();
  }

  return (
    <View
      className={twMerge(headerVariants(), className)}
      style={[{ paddingTop: insets.top }, style]}
    >
      <View className="py-sm px-lg gap-sm relative min-h-12 flex-row items-center">
        <Clickable
          className="size-6 items-center justify-center"
          onPress={handleBackPress}
        >
          <Icon
            name="arrow"
            size="lg"
            className="text-foreground"
            transform={[{ rotate: '90deg' }]}
          />
        </Clickable>
        {renderTitle?.() ?? (
          <View className="flex-1 items-center justify-center">
            <Text variant="labelXL" numberOfLines={1}>
              {title ?? nativeProps?.options?.title}
            </Text>
          </View>
        )}
        <Clickable
          className="size-6 items-center justify-center"
          onPress={onPressSuffix}
        >
          {typeof suffixIcon === 'string' && suffixIcon in SvgIcons ? (
            <Icon
              name={suffixIcon as IconNames}
              size="lg"
              className="text-foreground"
              transform={[{ rotate: '90deg' }]}
            />
          ) : (
            suffixIcon
          )}
        </Clickable>
      </View>
      {children && <View className="w-full">{children}</View>}
    </View>
  );
}
