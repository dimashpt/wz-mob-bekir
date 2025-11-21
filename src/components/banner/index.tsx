import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Button, ButtonProps } from '@/components/button';
import { Icon } from '@/components/icon';
import { Text, TextColor } from '@/components/text';

type BannerVariant = 'info' | 'warning' | 'danger';

type Props = {
  variant: BannerVariant;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  disabled?: boolean;
  buttonIcon?: ButtonProps['prefixIcon'];
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

type BannerVariantConfig = {
  iconClass: string;
  text: TextColor;
  button: ButtonProps['color'];
};

const bannerVariants = tv({
  base: 'p-md rounded-md justify-between gap-md border',
  variants: {
    variant: {
      info: 'bg-accent-soft border-accent',
      warning: 'bg-warning-light border-warning',
      danger: 'bg-danger-light border-danger',
    },
  },
  defaultVariants: {
    variant: 'warning',
  },
});

export const Banner: FC<Props> = ({
  variant,
  message,
  buttonText = '',
  onButtonPress,
  disabled,
  buttonIcon,
  icon,
  style,
  className,
}) => {
  const config: Record<BannerVariant, BannerVariantConfig> = {
    info: {
      iconClass: 'text-accent',
      text: 'accent',
      button: 'primary',
    },
    warning: {
      iconClass: 'text-warning',
      text: 'warning',
      button: 'warning',
    },
    danger: {
      iconClass: 'text-danger',
      text: 'danger',
      button: 'danger',
    },
  };

  return (
    <View
      className={twMerge(bannerVariants({ variant }), className)}
      style={style}
    >
      <View className="gap-sm flex-row items-center">
        {icon ? (
          icon
        ) : (
          <Icon
            name="info"
            size={20}
            className={config[variant].iconClass ?? 'text-accent'}
          />
        )}
        <Text variant="labelS" color={config[variant].text} className="shrink">
          {message}
        </Text>
      </View>
      {onButtonPress && (
        <Button
          onPress={onButtonPress}
          disabled={disabled}
          size="small"
          color={config[variant].button ?? 'primary'}
          prefixIcon={buttonIcon}
          style={[disabled && { opacity: 0.3 }]}
          text={buttonText}
          textProps={{ variant: 'labelS' }}
        />
      )}
    </View>
  );
};
