import React from 'react';
import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable, ClickableProps } from '../clickable';
import { Icon } from '../icon';

export type CheckboxSize = 'small' | 'medium' | 'large';

const checkboxVariants = tv({
  base: 'items-center justify-center rounded-full border-2',
  variants: {
    size: {
      small: 'size-lg',
      medium: 'size-2xl',
      large: 'size-3xl',
    },
    isSelected: {
      true: 'border-accent',
      false: 'border-border bg-transparent',
    },
  },
  defaultVariants: {
    size: 'medium',
    isSelected: false,
  },
});

const iconSizeMap = {
  small: 'sm',
  medium: '2xl',
  large: '3xl',
} as const;

interface CheckboxProps extends Omit<ClickableProps, 'children'> {
  isSelected: boolean;
  size?: CheckboxSize;
  className?: string;
}

export function Checkbox({
  isSelected,
  size = 'medium',
  onPress,
  className,
  ...props
}: CheckboxProps): React.JSX.Element {
  const checkboxContent = (
    <View
      className={twMerge(checkboxVariants({ size, isSelected }), className)}
    >
      {isSelected && (
        <Icon
          name="tickCircle"
          size={iconSizeMap[size]}
          className="text-accent"
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Clickable onPress={onPress} {...props}>
        {checkboxContent}
      </Clickable>
    );
  }

  return checkboxContent;
}
