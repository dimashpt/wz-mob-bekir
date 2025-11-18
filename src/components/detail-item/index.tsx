import { JSX } from 'react';
import { View, ViewStyle } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Icon, IconNames } from '../icon';
import { Text, TextProps } from '../text';

type DetailItemProps = {
  label: string;
  value: string;
  icon?: IconNames;
  className?: string;
  style?: ViewStyle;
  labelProps?: TextProps;
  valueProps?: TextProps;
};

export default function DetailItem({
  label,
  value,
  icon,
  className,
  style,
  labelProps,
  valueProps,
}: DetailItemProps): JSX.Element {
  return (
    <View
      className={twMerge(
        'gap-md flex-1 flex-row items-center self-start',
        className,
      )}
      style={style}
    >
      {icon ? (
        <Icon name={icon} size="base" className="text-foreground" />
      ) : null}
      <View>
        <Text variant="labelS" color="muted" {...labelProps}>
          {label}
        </Text>
        <Text variant="labelM" {...valueProps}>
          {value}
        </Text>
      </View>
    </View>
  );
}
