import type { IconNames } from '@/components/icon';

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { useCSSVariable } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Icon, SvgIcons } from '@/components/icon';
import { Text, TextProps } from '@/components/text';

type IconProp = IconNames | React.ReactElement;

const buttonVariants = tv({
  base: 'rounded-md items-center justify-center flex-row',
  variants: {
    variant: {
      filled: 'border-0',
      outlined: 'bg-transparent border-[1.5px]',
      ghost: 'bg-transparent border-0',
    },
    size: {
      small: 'px-sm py-xs py-xs',
      medium: 'px-md py-sm py-md',
      large: 'px-xl py-lg py-lg',
    },
    iconOnly: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      iconOnly: true,
      size: 'small',
      class: 'px-[6px] py-[6px] min-h-[32px] min-w-[32px]',
    },
    {
      iconOnly: true,
      size: 'medium',
      class: 'px-[10px] py-[10px] min-h-[44px] min-w-[44px]',
    },
    {
      iconOnly: true,
      size: 'large',
      class: 'px-[14px] py-[14px] min-h-[56px] min-w-[56px]',
    },
  ],
  defaultVariants: {
    variant: 'filled',
    size: 'medium',
    iconOnly: false,
  },
});

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  text?: string;
  children?: React.ReactNode;
  textProps?: TextProps;
  onPress?: () => void;
  variant?: 'filled' | 'outlined' | 'ghost';
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconProp;
  prefixIcon?: IconProp;
  suffixIcon?: IconProp;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function Button({
  text,
  children,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  prefixIcon,
  suffixIcon,
  textProps,
  onPress,
  style,
  className,
  ...props
}: ButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;

  // Get CSS variables for colors
  const primaryColor = useCSSVariable('--color-accent') as string;
  const subtleColor = useCSSVariable('--color-muted') as string;
  const errorColor = useCSSVariable('--color-danger') as string;
  const warningColor = useCSSVariable('--color-warning') as string;
  const successColor = useCSSVariable('--color-success') as string;
  const borderColor = useCSSVariable('--color-border') as string;
  const whiteColor = useCSSVariable('--color-white') as string;
  const foregroundSecondary = useCSSVariable('--color-muted') as string;
  const foregroundInvertedColor = useCSSVariable(
    '--color-foreground-inverted',
  ) as string;
  const foregroundMuted = useCSSVariable('--color-muted') as string;
  const disabledBgColor = useCSSVariable('--color-muted') as string;

  // Animation shared values
  const disabledValue = useSharedValue(isDisabled ? 1 : 0);

  // Update disabled animation when disabled state changes
  useEffect(() => {
    disabledValue.value = withTiming(isDisabled ? 1 : 0, {
      duration: isDisabled ? 200 : 300, // 200ms exit, 300ms enter
    });
  }, [isDisabled, disabledValue]);

  // Calculate colors outside of animated callbacks
  const backgroundColorMap: Record<string, string> = {
    primary: primaryColor,
    secondary: subtleColor,
    danger: errorColor,
    warning: warningColor,
    success: successColor,
  };

  const borderColorMap: Record<string, string> = {
    primary: primaryColor,
    secondary: borderColor,
    danger: errorColor,
    warning: warningColor,
    success: successColor,
  };

  const textColorMap: Record<string, string> = {
    primary: primaryColor,
    secondary: foregroundSecondary,
    danger: errorColor,
    warning: warningColor,
    success: successColor,
  };

  const enabledBackgroundColor =
    variant === 'filled'
      ? backgroundColorMap[color] || backgroundColorMap.primary
      : 'transparent';
  const enabledBorderColor =
    variant === 'outlined'
      ? borderColorMap[color] || borderColorMap.primary
      : 'transparent';
  const enabledTextColor =
    variant === 'filled'
      ? foregroundInvertedColor
      : textColorMap[color] || textColorMap.primary;

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => {
    // Ghost variant always has transparent background
    const backgroundColor =
      variant === 'ghost'
        ? 'transparent'
        : interpolateColor(
            disabledValue.value,
            [0, 1],
            [enabledBackgroundColor, disabledBgColor],
          );

    const borderColorValue = interpolateColor(
      disabledValue.value,
      [0, 1],
      [enabledBorderColor, disabledBgColor],
    );

    return {
      backgroundColor,
      borderColor: borderColorValue,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      disabledValue.value,
      [0, 1],
      [enabledTextColor, foregroundMuted],
    );

    return {
      color: textColor,
    };
  });

  const buttonClassName = twMerge(
    buttonVariants({
      variant,
      size,
      iconOnly: !!icon,
    }),
    className,
  );

  const textVariant =
    size === 'small' ? 'labelS' : size === 'medium' ? 'labelM' : 'labelL';

  const getIconColor = (): string => {
    if (isDisabled) {
      return foregroundMuted;
    }

    if (variant === 'filled') {
      return whiteColor;
    }

    // For outlined and ghost variants, use the appropriate color
    return textColorMap[color] || textColorMap.primary;
  };

  function renderIcon(
    icon: IconProp,
    style?: StyleProp<ViewStyle>,
  ): React.ReactNode {
    // If it's a React element, return it directly
    if (React.isValidElement(icon)) {
      return icon;
    }

    // If it's a string, treat it as an icon key
    if (typeof icon === 'string' && icon in SvgIcons) {
      return (
        <Icon
          name={icon as IconNames}
          size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
          color={getIconColor()}
          style={style}
        />
      );
    }

    return null;
  }

  return (
    <Clickable
      {...props}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      className={buttonClassName}
      style={[animatedButtonStyle, style]}
    >
      {children ? (
        children
      ) : loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'filled'
              ? foregroundInvertedColor
              : textColorMap[color] || textColorMap.primary
          }
          style={{ marginHorizontal: 8 }}
        />
      ) : icon ? (
        // Icon-only button
        renderIcon(icon)
      ) : (
        // Text button with optional prefix/suffix icons
        <>
          {prefixIcon && renderIcon(prefixIcon, { marginRight: 8 })}
          {text && (
            <Text
              variant={textVariant}
              style={animatedTextStyle}
              {...textProps}
            >
              {text}
            </Text>
          )}
          {suffixIcon && renderIcon(suffixIcon, { marginLeft: 8 })}
        </>
      )}
    </Clickable>
  );
}
