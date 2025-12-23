import React, { JSX } from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Clickable } from '../clickable';
import DetailItem from '../detail-item';
import { Icon, IconNames } from '../icon';
import { Text } from '../text';

export type MenuItemProps = {
  icon?: IconNames;
  label: string;
  value?: string | null;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
};

export type MenuItemActionProps = {
  icon?: IconNames;
  label: string;
  value?: string | null;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  rightElement?: React.ReactNode;
  loading?: boolean;
};

export function MenuItem({
  icon,
  label,
  value,
  onPress,
  className,
  style,
}: MenuItemProps): JSX.Element {
  const content = (
    <Clickable
      onPress={onPress}
      className={twMerge(
        'gap-md flex-row items-center',
        onPress ? 'w-full justify-between' : 'self-start',
        className,
      )}
      style={style}
    >
      <View className="gap-md flex-row items-center self-start">
        {icon ? (
          <Icon name={icon} size="base" className="text-foreground" />
        ) : null}
        <View>
          <DetailItem
            label={label}
            value={value ?? '-'}
            valueProps={{ variant: 'bodyM' }}
          />
        </View>
      </View>
      {onPress ? (
        <Icon
          name="chevron"
          transform={[{ rotate: '270deg' }]}
          className="text-foreground-muted"
        />
      ) : null}
    </Clickable>
  );

  return content;
}

export function MenuItemAction({
  icon,
  label,
  value,
  onPress,
  className,
  style,
  rightElement,
  loading,
}: MenuItemActionProps): JSX.Element {
  const content = (
    <Clickable
      onPress={onPress}
      className={twMerge('gap-xs flex-row items-center', className)}
      style={style}
    >
      <View className="gap-md flex-1 flex-row items-center">
        {icon ? (
          <Icon name={icon} size="base" className="text-foreground" />
        ) : null}
        <Text variant="bodyM">{label}</Text>
      </View>
      {value ? (
        loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text variant="bodyS" color="muted">
            {value}
          </Text>
        )
      ) : null}
      {rightElement === null
        ? null
        : (rightElement ?? (
            <Icon
              name="chevron"
              transform={[{ rotate: '270deg' }]}
              className="text-muted-foreground"
            />
          ))}
    </Clickable>
  );

  return content;
}

// Compound component - attach Action to MenuItem
MenuItem.Action = MenuItemAction;
