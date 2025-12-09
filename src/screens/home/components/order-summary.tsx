import React, { JSX } from 'react';
import { View } from 'react-native';

import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';
import {
  LineChart as GCLineChart,
  lineDataItem,
} from 'react-native-gifted-charts';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Container, Icon, Skeleton, Text } from '@/components';
import { ORDER_STORE_PLATFORMS_LOGOS } from '@/constants/order';
import { screenWidth } from '@/hooks';
import { StorePlatform } from '@/services/order';
import { formatNumber } from '@/utils/formatter';

interface ExtendedLineDataItem extends lineDataItem {
  date?: string;
}

const LineChart = withUniwind(GCLineChart);
const Image = withUniwind(ExpoImage);

const SOSCOM_COLOR = '#42B8D5';
const MP_COLOR = '#FFAF13';

const lineChartProps = {
  areaChart: true,
  // curved: true,
  overflowBottom: 8,
  hideDataPoints: true,
  color1: MP_COLOR,
  color2: SOSCOM_COLOR,
  startFillColor1: MP_COLOR,
  startFillColor2: SOSCOM_COLOR,
  endFillColor1: MP_COLOR,
  endFillColor2: SOSCOM_COLOR,
  startOpacity: 0.5,
  endOpacity: 0,
  isAnimated: true,
  noOfSections: 4,
  yAxisThickness: 0,
  xAxisThickness: 0,
  xAxisIndicesHeight: 4,
  xAxisLabelTextClassName: 'text-foreground',
  yAxisTextClassName: 'text-foreground',
  formatYLabel: (label: string) => formatNumber(label),
  disableScroll: true,
  adjustToWidth: true,
  pointerConfig: {
    pointerStripHeight: 160,
    pointerLabelWidth: 150,
    pointerLabelHeight: 50,
    activatePointersOnLongPress: true,
    autoAdjustPointerLabelPosition: false,
    pointerLabelComponent: (items: ExtendedLineDataItem[]) => {
      return (
        <View className="p-sm bg-background border-border mt-9 -ml-15 h-[50px] w-[150px] rounded-sm border">
          <Text variant="labelS">{items[0].date}</Text>
          <View className="gap-sm flex-row">
            <View className="gap-xs flex-row items-center">
              <View className="size-2 rounded-full bg-[#FFAF13]" />
              <Text variant="labelS">{formatNumber(items[0].value ?? 0)}</Text>
            </View>
            <View className="gap-xs flex-row items-center">
              <View className="size-2 rounded-full bg-[#42B8D5]" />
              <Text variant="labelS">{formatNumber(items[1].value ?? 0)}</Text>
            </View>
          </View>
        </View>
      );
    },
  },
};

interface OrderSummaryProps {
  range: string;
  summaryOrder?: {
    total_order?: number;
    total_order_marketplace?: number;
    total_order_soscom?: number;
  };
  summaryChartOrder?: {
    mp: ExtendedLineDataItem[];
    soscom: ExtendedLineDataItem[];
  };
  summaryMpOrder?: Partial<Record<StorePlatform, number>>;
}

export function OrderSummary({
  range,
  summaryOrder,
  summaryChartOrder,
  summaryMpOrder,
}: OrderSummaryProps): JSX.Element {
  const { t } = useTranslation();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const spacingMd = useCSSVariable('--spacing-md') as number;
  const accentColor = useCSSVariable('--color-accent') as string;

  const maxValue =
    Math.max(
      ...[
        (summaryChartOrder?.mp ?? []).map((v) => v.value ?? 0),
        (summaryChartOrder?.soscom ?? []).map((v) => v.value ?? 0),
      ].flat(),
    ) * 1.5; // Add 50% gap

  return (
    <Container.Card className="gap-lg shrink overflow-hidden">
      <View className="gap-sm flex-row items-center">
        <Icon name="cart" className="text-foreground" size="xl" />
        <Text variant="labelL">{t('home.order_summary')}</Text>
      </View>
      <View className="gap-xs">
        <Text variant="bodyS" color="muted">
          {t('home.total_order')}
        </Text>
        <View className="gap-sm flex-row">
          <Text variant="headingS">
            {formatNumber(summaryOrder?.total_order ?? 0)}
          </Text>
          <View>
            <View className="gap-xs flex-row items-center">
              <View className="size-2 rounded-full bg-[#FFAF13]" />
              <Text variant="bodyXS" color="muted">
                {t('home.marketplace')} (
                {formatNumber(summaryOrder?.total_order_marketplace ?? 0)})
              </Text>
            </View>
            <View className="gap-xs flex-row items-center">
              <View className="size-2 rounded-full bg-[#42B8D5]" />
              <Text variant="bodyXS" color="muted">
                {t('home.soscom')} (
                {formatNumber(summaryOrder?.total_order_soscom ?? 0)})
              </Text>
            </View>
          </View>
        </View>
      </View>
      {summaryChartOrder ? (
        <LineChart
          key={range}
          data={summaryChartOrder?.mp}
          data2={summaryChartOrder?.soscom}
          {...lineChartProps}
          maxValue={maxValue}
          width={screenWidth - spacingLg * 2 - spacingMd * 2 - 50}
          yAxisLabelWidth={40}
          pointerConfig={{
            ...lineChartProps.pointerConfig,
            pointerStripColor: accentColor,
            pointerColor: accentColor,
          }}
        />
      ) : (
        <Skeleton className="h-58" />
      )}
      <View className="gap-xs flex-row items-center">
        {Object.entries(ORDER_STORE_PLATFORMS_LOGOS).map(([store, image]) => (
          <View
            key={store}
            className="bg-background border-border p-xs flex-1 flex-row items-center justify-between rounded-sm border"
          >
            <Image className="size-4" contentFit="contain" source={image} />
            <Text variant="labelS">
              {summaryMpOrder?.[store as StorePlatform] ?? 0}
            </Text>
          </View>
        ))}
      </View>
    </Container.Card>
  );
}
