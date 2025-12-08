import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { LineChart as GCLineChart } from 'react-native-gifted-charts';
import { withUniwind } from 'uniwind';

import { Container, Icon, Text } from '@/components';
import { formatCurrency, formatNumber } from '@/utils/formatter';

const LineChart = withUniwind(GCLineChart);

const SOSCOM_COLOR = '#42B8D5';
const MP_COLOR = '#FFAF13';

const lineChartProps = {
  areaChart: true,
  curved: true,
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
  initialSpacing: 0,
  noOfSections: 4,
  yAxisThickness: 0,
  xAxisThickness: 0,
  xAxisIndicesHeight: 4,
  xAxisLabelTextClassName: 'text-foreground',
  yAxisTextClassName: 'text-foreground',
  formatYLabel: (label: string) => formatNumber(label),
};

interface RevenueSummaryProps {
  summaryTotalRevenue?: {
    total_revenue?: number;
    total_revenue_mp?: number;
    total_revenue_soscom?: number;
  };
  summaryChartRevenue?: {
    mp: Array<{ value: number; label?: string }>;
    soscom: Array<{ value: number; label?: string }>;
  };
}

export function RevenueSummary({
  summaryTotalRevenue,
  summaryChartRevenue,
}: RevenueSummaryProps): JSX.Element {
  const { t } = useTranslation();

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
      <LineChart
        data={summaryChartRevenue?.mp}
        data2={summaryChartRevenue?.soscom}
        {...lineChartProps}
      />
    </Container.Card>
  );
}
