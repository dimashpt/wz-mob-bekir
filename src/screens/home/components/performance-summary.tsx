import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Container, Icon, Text } from '@/components';
import { formatNumber } from '@/utils/formatter';

interface PerformanceSummaryProps {
  summaryPerformanceSummary?: {
    delivery_success?: number;
    delivery_success_rate?: string;
    order_cancel?: number;
    order_cancel_rate?: string;
    order_return?: number;
    order_return_rate?: string;
  };
}

export function PerformanceSummary({
  summaryPerformanceSummary,
}: PerformanceSummaryProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Container.Card className="flex-1">
      <Text variant="labelS">{t('home.performance_summary')}</Text>
      <View className="gap-sm flex-row items-center">
        <View className="bg-success p-sm rounded-full">
          <Icon name="truck" size="xl" className="text-white" />
        </View>
        <View>
          <Text variant="bodyXS" className="font-medium">
            {t('home.delivery_success')}
          </Text>
          <View className="gap-xs flex-row items-center">
            <Text variant="labelM">
              {formatNumber(summaryPerformanceSummary?.delivery_success ?? 0)}
            </Text>
            <Text variant="labelXS" color="success">
              ({summaryPerformanceSummary?.delivery_success_rate}%)
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-sm flex-row items-center">
        <View className="bg-danger p-sm rounded-full">
          <Icon name="close" size="xl" className="text-white" />
        </View>
        <View>
          <Text variant="bodyXS" className="font-medium">
            {t('home.order_canceled')}
          </Text>
          <View className="gap-xs flex-row items-center">
            <Text variant="labelM">
              {formatNumber(summaryPerformanceSummary?.order_cancel ?? 0)}
            </Text>
            <Text variant="labelXS" color="danger">
              ({summaryPerformanceSummary?.order_cancel_rate}%)
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-sm flex-row items-center">
        <View className="bg-accent p-sm rounded-full">
          <Icon
            name="refresh"
            size="xl"
            className="text-white"
            transform="scale(-1,1)"
          />
        </View>
        <View>
          <Text variant="bodyXS" className="font-medium">
            {t('home.order_returned')}
          </Text>
          <View className="gap-xs flex-row items-center">
            <Text variant="labelM">
              {formatNumber(summaryPerformanceSummary?.order_return ?? 0)}
            </Text>
            <Text variant="labelXS" color="accent">
              ({summaryPerformanceSummary?.order_return_rate}%)
            </Text>
          </View>
        </View>
      </View>
    </Container.Card>
  );
}
