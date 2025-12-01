import type { IconNames } from '@/components/icon';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';

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

const ASYNC_STATES = {
  INIT: 'init',
  PENDING: 'pending',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

type AsyncState = (typeof ASYNC_STATES)[keyof typeof ASYNC_STATES];

const buttonVariants = tv({
  base: 'rounded-full items-center justify-center flex-row',
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
  onPress?: () => void | Promise<void>;
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
  /**
   * Props to override default props when `onPress` async function throws.
   * @default {}
   */
  errorConfig?: Partial<ButtonProps>;
  /**
   * Props to override default props when button has been clicked but `onPress` function did not yet resolve.
   * @default {}
   */
  pendingConfig?: Partial<ButtonProps>;
  /**
   * Props to override default props when `onPress` async function resolves.
   * @default {}
   */
  successConfig?: Partial<ButtonProps>;
  /**
   * Time in milliseconds after which Button should stop using `errorConfig` / `successConfig` overrides.
   * @default 2000
   */
  resetTimeout?: number;
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
  errorConfig,
  pendingConfig,
  successConfig,
  resetTimeout = 2000,
  ...props
}: ButtonProps): React.JSX.Element {
  const [asyncState, setAsyncState] = useState<AsyncState>(ASYNC_STATES.INIT);
  const cancellablePromiseRef = useRef<{ cancelled: boolean } | undefined>(
    undefined,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Determine if button should show loading state
  // Manual loading prop takes precedence over async state
  const isAsyncPending = asyncState === ASYNC_STATES.PENDING && !loading;
  const isDisabled = disabled || loading || isAsyncPending;

  // Get CSS variables for colors
  const primaryColor = useCSSVariable('--color-accent') as string;
  const mutedColor = useCSSVariable('--color-muted') as string;
  const mutedForegroundColor = useCSSVariable(
    '--color-muted-foreground',
  ) as string;
  const errorColor = useCSSVariable('--color-danger') as string;
  const warningColor = useCSSVariable('--color-warning') as string;
  const successColor = useCSSVariable('--color-success') as string;
  const borderColor = useCSSVariable('--color-border') as string;
  const whiteColor = useCSSVariable('--color-white') as string;
  const foregroundSecondary = useCSSVariable('--color-muted') as string;
  const foregroundInvertedColor = useCSSVariable(
    '--color-foreground-inverted',
  ) as string;
  const foregroundMuted = useCSSVariable('--color-muted-foreground') as string;
  const disabledBgColor = useCSSVariable('--color-muted') as string;

  // Animation shared values
  const disabledValue = useSharedValue(isDisabled ? 1 : 0);
  const asyncStateValue = useSharedValue(
    asyncState === ASYNC_STATES.PENDING
      ? 1
      : asyncState === ASYNC_STATES.ERROR
        ? 2
        : asyncState === ASYNC_STATES.SUCCESS
          ? 3
          : 0,
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancellablePromiseRef.current) {
        cancellablePromiseRef.current.cancelled = true;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update disabled animation when disabled state changes
  useEffect(() => {
    disabledValue.value = withTiming(isDisabled ? 1 : 0, {
      duration: isDisabled ? 200 : 300, // 200ms exit, 300ms enter
    });
  }, [isDisabled, disabledValue]);

  // Update async state animation
  useEffect(() => {
    const stateValue =
      asyncState === ASYNC_STATES.PENDING
        ? 1
        : asyncState === ASYNC_STATES.ERROR
          ? 2
          : asyncState === ASYNC_STATES.SUCCESS
            ? 3
            : 0;
    asyncStateValue.value = withTiming(stateValue, {
      duration: 200,
    });
  }, [asyncState, asyncStateValue]);

  // Calculate colors outside of animated callbacks
  const backgroundColorMap: Record<string, string> = {
    primary: primaryColor,
    secondary: mutedColor,
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

  // Handle async onPress
  const handleAsyncPress = useCallback((): void => {
    if (!onPress) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    // Cancel previous promise if exists
    if (cancellablePromiseRef.current) {
      cancellablePromiseRef.current.cancelled = true;
    }

    // Create new cancellation ref
    const cancellationRef = { cancelled: false };
    cancellablePromiseRef.current = cancellationRef;

    const onSuccess = (): void => {
      if (cancellationRef.cancelled) {
        return;
      }
      setAsyncState(ASYNC_STATES.SUCCESS);
    };

    const onError = (): void => {
      if (cancellationRef.cancelled) {
        return;
      }
      setAsyncState(ASYNC_STATES.ERROR);
    };

    const finallyCallback = (): void => {
      if (cancellationRef.cancelled) {
        return;
      }
      timeoutRef.current = setTimeout(() => {
        if (!cancellationRef.cancelled) {
          setAsyncState(ASYNC_STATES.INIT);
        }
      }, resetTimeout);
    };

    try {
      const result = onPress();
      setAsyncState(ASYNC_STATES.PENDING);

      if (result instanceof Promise) {
        result.then(onSuccess).catch(onError).finally(finallyCallback);
      } else {
        onSuccess();
        finallyCallback();
      }
    } catch {
      onError();
      finallyCallback();
    }
  }, [onPress, resetTimeout]);

  // Merge props based on async state
  const getMergedProps = (): Partial<ButtonProps> => {
    const stateConfig =
      asyncState === ASYNC_STATES.ERROR
        ? errorConfig
        : asyncState === ASYNC_STATES.PENDING
          ? pendingConfig
          : asyncState === ASYNC_STATES.SUCCESS
            ? successConfig
            : null;

    if (!stateConfig) {
      return {};
    }

    return stateConfig;
  };

  const mergedProps = getMergedProps();
  const finalText = mergedProps.text ?? text;
  const finalIcon = mergedProps.icon ?? icon;
  const finalPrefixIcon = mergedProps.prefixIcon ?? prefixIcon;
  const finalSuffixIcon = mergedProps.suffixIcon ?? suffixIcon;
  const finalChildren = mergedProps.children ?? children;
  const finalClassName = mergedProps.className
    ? twMerge(className, mergedProps.className)
    : className;
  const finalStyle = mergedProps.style ? [style, mergedProps.style] : style;

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
      [enabledTextColor, mutedForegroundColor],
    );

    return {
      color: textColor,
    };
  });

  const buttonClassName = twMerge(
    buttonVariants({
      variant,
      size,
      iconOnly: !!finalIcon,
    }),
    finalClassName,
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
      onPress={isDisabled ? undefined : handleAsyncPress}
      disabled={isDisabled}
      className={buttonClassName}
      style={[animatedButtonStyle, finalStyle]}
    >
      {finalChildren ? (
        finalChildren
      ) : finalIcon ? (
        // Icon-only button
        renderIcon(finalIcon)
      ) : (
        // Text button with optional prefix/suffix icons
        <>
          {finalPrefixIcon && renderIcon(finalPrefixIcon, { marginRight: 8 })}
          {finalText && (
            <Text
              variant={textVariant}
              style={animatedTextStyle}
              {...textProps}
              {...mergedProps.textProps}
            >
              {finalText}
            </Text>
          )}
          {finalSuffixIcon && renderIcon(finalSuffixIcon, { marginLeft: 8 })}
        </>
      )}
    </Clickable>
  );
}
