import React, { forwardRef } from 'react';
import { TextProps as RNTextProps } from 'react-native';

import Animated, { AnimatedProps } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Skeleton, SkeletonProps } from '../skeleton';

export type TextVariant =
  | 'headingXS'
  | 'headingS'
  | 'headingM'
  | 'headingL'
  | 'headingXL'
  | 'labelXS'
  | 'labelS'
  | 'labelM'
  | 'labelL'
  | 'labelXL'
  | 'bodyXS'
  | 'bodyS'
  | 'bodyM'
  | 'bodyL'
  | 'bodyXL';
export type TextColor =
  | 'default'
  | 'light'
  | 'dark'
  | 'muted'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'placeholder';

const textVariants = tv({
  base: '',
  variants: {
    color: {
      default: 'text-foreground',
      light: 'text-white',
      dark: 'text-black',
      muted: 'text-muted',
      accent: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
      placeholder: 'text-field-placeholder',
    } as Record<TextColor, string>,
    variant: {
      headingXS: 'font-sans font-bold android:font-map-bold text-xl/tight',
      headingS: 'font-sans font-bold android:font-map-bold text-2xl/tight',
      headingM: 'font-sans font-bold android:font-map-bold text-3xl/tight',
      headingL: 'font-sans font-bold android:font-map-bold text-4xl/tight',
      headingXL: 'font-sans font-bold android:font-map-bold text-5xl/tight',
      labelXS:
        'font-sans font-semibold android:font-map-semibold text-xs/tight',
      labelS: 'font-sans font-semibold android:font-map-semibold text-sm/tight',
      labelM:
        'font-sans font-semibold android:font-map-semibold text-base/tight',
      labelL: 'font-sans font-semibold android:font-map-semibold text-lg/tight',
      labelXL:
        'font-sans font-semibold android:font-map-semibold text-xl/tight',
      bodyXS: 'font-sans font-normal android:font-map-normal text-xs/tight',
      bodyS: 'font-sans font-normal android:font-map-normal text-sm/tight',
      bodyM: 'font-sans font-normal android:font-map-normal text-base/tight',
      bodyL: 'font-sans font-normal android:font-map-normal text-lg/tight',
      bodyXL: 'font-sans font-normal android:font-map-normal text-xl/tight',
    },
  },
  defaultVariants: {
    type: 'default',
    variant: 'bodyM',
  },
});

export interface TextProps extends Omit<AnimatedProps<RNTextProps>, 'style'> {
  loading?: boolean;
  skeletonProps?: SkeletonProps;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  style?: RNTextProps['style'];
}

export const Text = forwardRef<
  React.ElementRef<typeof Animated.Text>,
  TextProps
>(
  (
    {
      loading,
      skeletonProps,
      variant = 'bodyM',
      color = 'default',
      className,
      ...props
    },
    _ref,
  ): React.ReactNode => {
    // Return skeleton when loading is true
    if (loading) {
      return <SkeletonText skeletonProps={skeletonProps} variant={variant} />;
    }

    return (
      <Animated.Text
        {...props}
        className={twMerge(textVariants({ color, variant }), className)}
      />
    );
  },
);

const SkeletonText = ({
  skeletonProps,
  variant,
}: {
  skeletonProps?: SkeletonProps;
  variant?: TextVariant;
}): React.ReactNode => {
  const getSkeletonDimensions = (): {
    width: number;
    height: number;
  } => {
    // Default dimensions based on text variant
    // Using fixed pixel widths to prevent overflow in flex containers
    const variantDimensions: Record<
      TextVariant,
      { width: number; height: number }
    > = {
      labelXS: { width: 60, height: 10 },
      labelS: { width: 80, height: 14 },
      labelM: { width: 100, height: 18 },
      labelL: { width: 120, height: 20 },
      labelXL: { width: 140, height: 24 },
      bodyXS: { width: 100, height: 14 },
      bodyS: { width: 120, height: 18 },
      bodyM: { width: 140, height: 20 },
      bodyL: { width: 160, height: 24 },
      bodyXL: { width: 180, height: 28 },
      headingXS: { width: 140, height: 28 },
      headingS: { width: 160, height: 32 },
      headingM: { width: 180, height: 36 },
      headingL: { width: 200, height: 42 },
      headingXL: { width: 220, height: 54 },
    };

    return variant && variantDimensions[variant]
      ? variantDimensions[variant]
      : { width: 120, height: 16 }; // Default fallback with fixed width
  };

  const defaultDimensions = getSkeletonDimensions();

  return (
    <Skeleton
      style={{
        // Ensure skeleton doesn't overflow in flex containers
        maxWidth: '100%',
        flexShrink: 1,
        width: defaultDimensions.width,
        height: defaultDimensions.height,
        ...skeletonProps?.style,
      }}
      {...skeletonProps}
    />
  );
};
