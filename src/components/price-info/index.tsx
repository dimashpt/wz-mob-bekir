import React, { JSX } from 'react';
import { View } from 'react-native';

import { twMerge } from 'tailwind-merge';

import { formatCurrency } from '@/utils/formatter';
import { Divider } from '../divider';
import { Text } from '../text';

type PriceInfoProps = {
  label: string;
  value: string | number;
  error?: boolean;
  loading?: boolean;
};

export function PriceInfo({
  label,
  value,
  error,
  loading,
}: PriceInfoProps): JSX.Element {
  return (
    <View className="gap-sm flex-row items-center justify-between">
      <Text variant="labelS" color={error ? 'danger' : 'default'}>
        {label}
      </Text>
      <Divider
        className={twMerge(
          'mx-sm bg-muted flex-1',
          error ? 'bg-danger-soft' : '',
        )}
      />
      <Text
        variant="labelS"
        color={error ? 'danger' : 'default'}
        loading={loading}
      >
        {formatCurrency(value)}
      </Text>
    </View>
  );
}
