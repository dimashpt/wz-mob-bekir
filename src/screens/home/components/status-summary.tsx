import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Container, Text } from '@/components';

interface StatusSummaryProps {
  summaryStatusMarketplace?: Partial<
    Record<
      string,
      {
        store_group: string;
        success: number;
        on_delivery: number;
        on_process: number;
        return: number;
        cancel: number;
      }
    >
  >;
}

export function StatusSummary({
  summaryStatusMarketplace,
}: StatusSummaryProps): JSX.Element {
  const { t } = useTranslation();

  const marketplaceData =
    summaryStatusMarketplace?.marketplace ||
    summaryStatusMarketplace?.['marketplace'];

  return (
    <Container.Card className="flex-1">
      <Text variant="labelS">{t('home.status_summary')}</Text>
      <View className="gap-sm flex-row">
        <View className="bg-muted h-36 w-12 rounded-sm" />
        <View className="justify-between">
          {marketplaceData && (
            <>
              <View className="gap-xs flex-row items-center">
                <View className={twMerge('size-4 rounded-xs', 'bg-success')} />
                <Text variant="labelXS">{t('home.status_success')}</Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <View className={twMerge('size-4 rounded-xs', 'bg-warning')} />
                <Text variant="labelXS">{t('home.status_on_delivery')}</Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <View className={twMerge('size-4 rounded-xs', 'bg-info')} />
                <Text variant="labelXS">{t('home.status_on_process')}</Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <View className={twMerge('size-4 rounded-xs', 'bg-accent')} />
                <Text variant="labelXS">{t('home.status_return')}</Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <View className={twMerge('size-4 rounded-xs', 'bg-danger')} />
                <Text variant="labelXS">{t('home.status_cancel')}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Container.Card>
  );
}
