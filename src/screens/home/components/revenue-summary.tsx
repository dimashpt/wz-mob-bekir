import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  LineChart as GCLineChart,
  lineDataItem,
} from 'react-native-gifted-charts';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Container, Icon, Skeleton, Text } from '@/components';
import { screenWidth } from '@/hooks';
import { formatCurrency, formatNumber } from '@/utils/formatter';

interface ExtendedLineDataItem extends lineDataItem {
  date?: string;
}

const LineChart = withUniwind(GCLineChart);

const SOSCOM_COLOR = '#42B8D5';
const MP_COLOR = '#FFAF13';

const formatCompactNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (absNum >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (absNum >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }

  return formatNumber(num);
};

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
  formatYLabel: formatCompactNumber,
  disableScroll: true,
  adjustToWidth: true,
  pointerConfig: {
    pointerStripHeight: 160,
    pointerStripColor: 'navy',
    pointerColor: 'navy',
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

interface RevenueSummaryProps {
  range: string;
  summaryTotalRevenue?: {
    total_revenue?: number;
    total_revenue_mp?: number;
    total_revenue_soscom?: number;
  };
  summaryChartRevenue?: {
    mp: Array<{ value: number; label?: string; date?: string }>;
    soscom: Array<{ value: number; label?: string; date?: string }>;
  };
}

export function RevenueSummary({
  range,
  summaryTotalRevenue,
  summaryChartRevenue,
}: RevenueSummaryProps): JSX.Element {
  const { t } = useTranslation();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const spacingMd = useCSSVariable('--spacing-md') as number;

  const maxValue =
    Math.max(
      ...[
        (summaryChartRevenue?.mp ?? []).map((v) => v.value ?? 0),
        (summaryChartRevenue?.soscom ?? []).map((v) => v.value ?? 0),
      ].flat(),
    ) * 1.2; // Add 20% gap

  return (
    <Container.Card className="gap-lg shrink overflow-hidden">
      <View className="gap-md">
        <View className="gap-sm flex-row items-center">
          <Icon name="chartGrow" className="text-foreground" size="xl" />
          <Text variant="labelL">{t('home.revenue_summary')}</Text>
        </View>
        <View>
          <Text variant="bodyS" color="muted">
            {t('home.total_revenue')}
          </Text>
          <Text variant="headingS">
            {formatCurrency(summaryTotalRevenue?.total_revenue ?? 0)}
          </Text>
        </View>
        <View className="gap-sm flex-row">
          <View className="gap-sm flex-1 flex-row">
            <View className="h-full w-2 rounded-full bg-[#FFAF13]" />
            <View className="gap-xxs">
              <Text variant="bodyS" color="muted">
                {t('home.revenue_mp')}
              </Text>
              <Text variant="labelL">
                {formatCurrency(summaryTotalRevenue?.total_revenue_mp ?? 0)}
              </Text>
            </View>
          </View>
          <View className="gap-sm flex-1 flex-row">
            <View className="h-full w-2 rounded-full bg-[#42B8D5]" />
            <View className="gap-xxs">
              <Text variant="bodyS" color="muted">
                {t('home.revenue_soscom')}
              </Text>
              <Text variant="labelL">
                {formatCurrency(summaryTotalRevenue?.total_revenue_soscom ?? 0)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {summaryChartRevenue ? (
        <LineChart
          key={range}
          data={summaryChartRevenue?.mp}
          data2={summaryChartRevenue?.soscom}
          {...lineChartProps}
          maxValue={maxValue}
          width={screenWidth - spacingLg * 2 - spacingMd * 2 - 50}
          yAxisLabelWidth={40}
        />
      ) : (
        <Skeleton className="h-58" />
      )}
    </Container.Card>
  );
}
