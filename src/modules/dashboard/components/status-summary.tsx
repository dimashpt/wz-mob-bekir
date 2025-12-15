import React, { JSX, useMemo } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Container, Text } from '@/components';

interface StatusData {
  store_group: string;
  success: number;
  on_delivery: number;
  on_process: number;
  return: number;
  cancel: number;
}

interface StatusSummaryProps {
  summaryStatusMarketplace?: Partial<Record<string, StatusData>>;
}

export function StatusSummary({
  summaryStatusMarketplace,
}: StatusSummaryProps): JSX.Element {
  const { t } = useTranslation();

  const { segments, total } = useMemo(() => {
    // const mpData = summaryStatusMarketplace?.marketplace;
    const soscomData = summaryStatusMarketplace?.soscom;

    if (!soscomData) return { segments: [], total: 0 };

    // NOTES: Only show soscom data due to updated requirement
    const success = Number(soscomData?.success ?? 0);
    const onDelivery = Number(soscomData?.on_delivery ?? 0);
    const onProcess = Number(soscomData?.on_process ?? 0);
    const orderReturn = Number(soscomData?.return ?? 0);
    const cancel = Number(soscomData?.cancel ?? 0);

    const total = success + onDelivery + onProcess + orderReturn + cancel;

    if (total === 0) return { segments: [], total: 0 };

    const statusValues = [
      { key: 'success', value: success },
      { key: 'on_delivery', value: onDelivery },
      { key: 'on_process', value: onProcess },
      { key: 'return', value: orderReturn },
      { key: 'cancel', value: cancel },
    ];

    const STATUS_CONFIG = [
      { key: 'success', color: 'bg-success', label: 'home.status_success' },
      {
        key: 'on_delivery',
        color: 'bg-warning',
        label: 'home.status_on_delivery',
      },
      { key: 'on_process', color: 'bg-info', label: 'home.status_on_process' },
      { key: 'return', color: 'bg-accent', label: 'home.status_return' },
      { key: 'cancel', color: 'bg-danger', label: 'home.status_cancel' },
    ];

    const segments = statusValues
      .map((status) => {
        const config = STATUS_CONFIG.find((c) => c.key === status.key);
        if (!config) return null;

        const percentage = total > 0 ? (status.value / total) * 100 : 0;

        return {
          ...config,
          value: status.value,
          percentage,
        };
      })
      .filter(
        (segment): segment is NonNullable<typeof segment> => segment !== null,
      );

    return { segments, total };
  }, [summaryStatusMarketplace]);

  return (
    <Container.Card className="flex-1" index={2}>
      <Text variant="labelS">{t('home.status_summary')}</Text>
      <View className="gap-md">
        {/* Bar Chart */}
        {segments.length > 0 && (
          <View className="gap-sm">
            <View className="h-5 w-full flex-row overflow-hidden rounded-xs">
              {segments.map((segment, index) => (
                <View
                  key={segment.key}
                  className={segment.color}
                  style={{
                    flex: segment.percentage,
                    // backgroundColor: segment.color,
                    marginLeft: index === 0 ? 0 : 1,
                  }}
                />
              ))}
            </View>
            <Text variant="bodyXS" color="muted">
              Total: {total}
            </Text>
          </View>
        )}

        {/* Legend */}
        <View className="gap-xs">
          {segments.map((segment) => (
            <View key={segment.key} className="gap-xs flex-row items-center">
              <View className={twMerge('size-3 rounded-xs', segment.color)} />
              <View className="flex-1">
                <Text variant="labelXS">{t(segment.label)}</Text>
              </View>
              <View className="items-end">
                <Text variant="labelXS" className="font-semibold">
                  {segment.value}
                </Text>
                <Text variant="bodyXS" color="muted">
                  {segment.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Container.Card>
  );
}
