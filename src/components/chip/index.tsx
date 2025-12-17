import React from 'react';
import { View, ViewStyle } from 'react-native';

import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Text, TextProps } from '../text';

export type ChipVariant =
  | 'blue'
  | 'gray'
  | 'yellow'
  | 'red'
  | 'green'
  | 'clear';

const chipVariants = tv({
  base: 'flex-row justify-center items-center rounded-full py-xs px-sm gap-xs border self-start',
  variants: {
    variant: {
      blue: 'bg-accent-soft text-accent border-accent',
      gray: 'bg-muted text-muted-foreground border-border',
      yellow: 'bg-warning-soft text-warning border-warning',
      red: 'bg-danger-soft text-danger border-danger',
      green: 'bg-success-soft text-success border-success',
      clear: 'bg-transparent text-muted-foreground border-transparent',
    },
  },
  defaultVariants: {
    variant: 'clear',
  },
});

const textVariants = tv({
  base: 'text-[0.625rem]/tight text-center',
  variants: {
    variant: {
      blue: 'text-accent',
      gray: 'text-foreground-muted',
      yellow: 'text-warning',
      red: 'text-danger',
      green: 'text-success',
      clear: 'text-foreground-muted',
    },
  },
  defaultVariants: {
    variant: 'clear',
  },
});

export interface ChipProps {
  label: string; // Label text
  variant: ChipVariant; // Predefined color variants
  style?: ViewStyle;
  className?: string;
  textProps?: TextProps;
  prefix?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant,
  style,
  className,
  textProps,
  prefix,
}) => {
  return (
    <View
      className={twMerge(chipVariants({ variant }), className)}
      style={style}
    >
      {prefix}
      <Text
        variant="labelXS"
        className={textVariants({ variant })}
        {...textProps}
      >
        {label}
      </Text>
    </View>
  );
};
