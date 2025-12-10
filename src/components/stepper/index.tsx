import type { IconNames } from '@/components/icon';

import React from 'react';
import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

export type StepperStatus = 'completed' | 'active' | 'pending' | 'error';

interface StepperItem {
  key: string;
  label: string;
  status: StepperStatus;
  icon?: IconNames;
}

interface StepperProps {
  items: StepperItem[];
}

const getStatusColor = (status: StepperStatus): string => {
  switch (status) {
    case 'completed':
      return 'bg-accent';
    case 'active':
      return 'bg-accent';
    case 'error':
      return 'bg-danger';
    case 'pending':
    default:
      return 'bg-muted';
  }
};

const getStatusIcon = (
  status: StepperStatus,
  icon?: IconNames,
): IconNames | null => {
  switch (status) {
    case 'completed':
      return 'tick';
    case 'error':
      return 'closeCircle';
    case 'active':
    case 'pending':
    default:
      return icon ?? null;
  }
};

export const Stepper = React.memo(({ items }: StepperProps) => {
  return (
    <View className="gap-xs">
      <View className="flex-row items-center justify-between">
        {items.map((item, index) => {
          const icon = getStatusIcon(item.status, item.icon);
          const colorClass = getStatusColor(item.status);
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <View
              key={item.key}
              className="gap-xs flex-1 flex-row items-center"
            >
              {/* Connector line */}
              <View
                className={twMerge(
                  'h-0.5 grow',
                  items.at(index - 1)?.status === 'completed'
                    ? 'bg-accent'
                    : 'bg-muted',
                  isFirst ? 'bg-transparent' : '',
                )}
              />

              {/* Circle indicator */}
              <View
                className={twMerge(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border-2',
                  item.status === 'active' || item.status === 'completed'
                    ? 'border-accent'
                    : item.status === 'error'
                      ? 'border-danger'
                      : 'border-muted',
                  colorClass,
                )}
              >
                {icon ? (
                  <Icon
                    name={icon}
                    size="base"
                    className={
                      item.status === 'error'
                        ? 'text-surface'
                        : item.status === 'completed' ||
                            item.status === 'active'
                          ? 'text-surface'
                          : 'text-muted-foreground'
                    }
                  />
                ) : (
                  <Text
                    variant="labelXS"
                    className={
                      item.status === 'active'
                        ? 'text-surface'
                        : 'text-muted-foreground'
                    }
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connector line */}
              <View
                className={twMerge(
                  'h-0.5 grow',
                  item.status === 'completed' ? 'bg-accent' : 'bg-muted',
                  isLast ? 'bg-transparent' : '',
                )}
              />
            </View>
          );
        })}
      </View>

      {/* Labels below */}
      <View className="gap-xs flex-row items-start">
        {items.map((item) => (
          <View key={`label-${item.key}`} className="flex-1">
            <Text
              variant="labelXS"
              color={
                item.status === 'error'
                  ? 'danger'
                  : item.status === 'active' || item.status === 'completed'
                    ? 'default'
                    : 'muted'
              }
              className="text-center font-medium"
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
