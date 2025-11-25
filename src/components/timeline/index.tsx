import React from 'react';
import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

export type TimelineStatus = 'success' | 'pending' | 'error';

interface TimelineItem {
  status: TimelineStatus;
  title: string;
  subtitle?: string | null;
  timestamp?: string | null;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline = React.memo(({ items }: TimelineProps) => {
  // Rendered items
  const renderedItems = items.map(
    ({ status, title, subtitle, timestamp }, index) => (
      <View
        key={`timeline-item-${index}`}
        className="gap-md flex-row items-start"
      >
        <View className="bg-surface border-accent p-xxs flex-row items-center justify-center rounded-full border-2">
          <View
            className={twMerge(
              'rounded-full',
              status !== 'success' && 'bg-accent',
            )}
          >
            {status === 'success' ? (
              <Icon name="tickCircle" size="sm" className="text-accent" />
            ) : status === 'error' ? (
              <Icon name="closeCircle" size="sm" className="text-danger" />
            ) : (
              <Icon name="tick" size="sm" className="text-accent" />
            )}
          </View>
        </View>
        <View className="flex-1 shrink gap-1">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 shrink">
              <Text variant="labelM" className="flex-wrap">
                {title}
              </Text>
            </View>
            <Text variant="bodyXS" color="muted" className="ml-1 shrink-0">
              {timestamp}
            </Text>
          </View>
          <Text variant="labelXS" color="muted">
            {subtitle}
          </Text>
        </View>
      </View>
    ),
  );

  return (
    <View className="gap-6">
      <View className="my-lg w-xxs bg-accent absolute top-0 bottom-[10px] left-[10px]" />
      {renderedItems}
    </View>
  );
});
