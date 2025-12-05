import React, { JSX, useState } from 'react';
import { BackHandler, View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
import { Image as ExpoImage } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LineChart as GCLineChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { withUniwind } from 'uniwind';

import { Container, Icon, SelectDateTime, Text } from '@/components';
import { ORDER_STORE_PLATFORMS_LOGOS } from '@/constants/order';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useNotification } from '@/hooks';
import { DashboardPayload } from '@/services/dashboard';
import { StorePlatform } from '@/services/order';
import { formatCurrency, formatNumber } from '@/utils/formatter';
import { useDashboardStats } from './hooks/use-dashboard-stats';

const Image = withUniwind(ExpoImage);
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

type OrderStatus =
  | 'success'
  | 'on_delivery'
  | 'on_process'
  | 'return'
  | 'cancel';

const statusColorClassName: Record<OrderStatus, string> = {
  success: 'bg-success',
  on_delivery: 'bg-warning',
  on_process: 'bg-info',
  return: 'bg-accent',
  cancel: 'bg-danger',
};

const statusLabel: Record<OrderStatus, string> = {
  success: 'Sukses',
  on_delivery: 'Dikirim',
  on_process: 'Diproses',
  return: 'Dikembalikan',
  cancel: 'Dibatalkan',
};

export default function HomeScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<{ start: Dayjs; end: Dayjs } | null>({
    start: dayjs('2025-11-01'),
    end: dayjs('2025-11-30'),
  });

  // Setup notification
  useNotification();

  const fetchEnabled = Boolean(range);
  const payload: DashboardPayload = {
    date_from: range?.start ? range?.start?.format('YYYY-MM-DD') : '',
    date_to: range?.end ? range?.end?.format('YYYY-MM-DD') : '',
  };

  // Dashboard queries
  const {
    summaryChartOrder,
    summaryOrder,
    summaryMpOrder,
    summaryChartRevenue,
    summaryTotalRevenue,
    summaryStatusMarketplace,
    summaryPerformanceSummary,
    summaryProcessSummary,
  } = useDashboardStats(fetchEnabled, payload);

  /**
   * Handle back press to exit app, if not handled, the expo router will throw error:
   * `The action 'GO_BACK' was not handled by any navigator.`
   */
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  // TODO: Set user info for Sentry

  function handleBackPress(): boolean {
    BackHandler.exitApp();

    return true;
  }

  return (
    <Container.Scroll
      contentContainerClassName="bg-background p-lg gap-md"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: TAB_BAR_HEIGHT,
      }}
    >
      <Text variant="headingL">{t('home.title')}</Text>
      <SelectDateTime
        placeholder="Select Period"
        mode="date-range"
        className="bg-surface"
        enableRange
        onRangeSelect={setRange}
      />
      <View className="gap-md flex-1">
        {/** REVENUE SUMMARY */}
        <Container.Card className="gap-lg shrink overflow-hidden">
          <View className="gap-md">
            <View className="gap-sm flex-row items-center">
              <Icon name="chartGrow" className="text-foreground" size="xl" />
              <Text variant="labelL">Revenue Summary</Text>
            </View>
            <View>
              <Text variant="bodyS" color="muted">
                Total Revenue
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
                    Revenue (MP)
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
                    Revenue (Soscom)
                  </Text>
                  <Text variant="labelL">
                    {formatCurrency(
                      summaryTotalRevenue?.total_revenue_soscom ?? 0,
                    )}
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

        {/** ORDER SUMMARY */}
        <Container.Card className="gap-lg shrink overflow-hidden">
          <View className="gap-sm flex-row items-center">
            <Icon name="cart" className="text-foreground" size="xl" />
            <Text variant="labelL">Order Summary</Text>
          </View>
          <View className="gap-xs">
            <Text variant="bodyS" color="muted">
              Total Order
            </Text>
            <View className="gap-sm flex-row">
              <Text variant="headingS">
                {formatNumber(summaryOrder?.total_order ?? 0)}
              </Text>
              <View>
                <View className="gap-xs flex-row items-center">
                  <View className="size-2 rounded-full bg-[#FFAF13]" />
                  <Text variant="bodyXS" color="muted">
                    Marketplace (
                    {formatNumber(summaryOrder?.total_order_marketplace ?? 0)})
                  </Text>
                </View>
                <View className="gap-xs flex-row items-center">
                  <View className="size-2 rounded-full bg-[#42B8D5]" />
                  <Text variant="bodyXS" color="muted">
                    Soscom (
                    {formatNumber(summaryOrder?.total_order_soscom ?? 0)})
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <LineChart
            data={summaryChartOrder?.mp}
            data2={summaryChartOrder?.soscom}
            {...lineChartProps}
          />
          <View className="gap-xs flex-row items-center">
            {Object.entries(ORDER_STORE_PLATFORMS_LOGOS).map(
              ([store, image]) => (
                <View
                  key={store}
                  className="bg-background border-border p-xs flex-1 flex-row items-center justify-between rounded-sm border"
                >
                  <Image
                    className="size-4"
                    contentFit="contain"
                    source={image}
                  />
                  <Text variant="labelS">
                    {summaryMpOrder?.[store as StorePlatform] ?? 0}
                  </Text>
                </View>
              ),
            )}
          </View>
        </Container.Card>

        <View className="gap-md flex-row">
          <Container.Card className="flex-1">
            <Text variant="labelS">Status Summary</Text>
            <View className="gap-sm flex-row">
              <View className="bg-muted h-36 w-12 rounded-sm" />
              <View className="justify-between">
                {Object.keys(summaryStatusMarketplace?.marketplace ?? {})
                  .filter((key) => key !== 'store_group')
                  .map((key) => (
                    <View className="gap-xs flex-row items-center" key={key}>
                      <View
                        className={twMerge(
                          'size-4 rounded-xs',
                          statusColorClassName[key as OrderStatus],
                        )}
                      />
                      <Text variant="labelXS">
                        {statusLabel[key as OrderStatus]}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </Container.Card>
          <Container.Card className="flex-1">
            <Text variant="labelS">Performance Summary</Text>
            <View className="gap-sm flex-row items-center">
              <View className="bg-success p-sm rounded-full">
                <Icon name="truck" size="xl" className="text-white" />
              </View>
              <View>
                <Text variant="bodyXS" className="font-medium">
                  Delivery Success
                </Text>
                <View className="gap-xs flex-row items-center">
                  <Text variant="headingXS">
                    {formatNumber(
                      summaryPerformanceSummary?.delivery_success ?? 0,
                    )}
                  </Text>
                  <Text variant="bodyM" color="success">
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
                  Order Canceled
                </Text>
                <View className="gap-xs flex-row items-center">
                  <Text variant="headingXS">
                    {formatNumber(summaryPerformanceSummary?.order_cancel ?? 0)}
                  </Text>
                  <Text variant="bodyM" color="danger">
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
                  Order Returned
                </Text>
                <View className="gap-xs flex-row items-center">
                  <Text variant="headingXS">
                    {formatNumber(summaryPerformanceSummary?.order_return ?? 0)}
                  </Text>
                  <Text variant="bodyM" color="accent">
                    ({summaryPerformanceSummary?.order_return_rate}%)
                  </Text>
                </View>
              </View>
            </View>
          </Container.Card>
        </View>
        <View className="gap-md flex-row">
          <Container.Card className="flex-1">
            <Text variant="labelXS">Problem Processed</Text>
            <Text variant="headingXS">
              {formatNumber(summaryProcessSummary?.problem_process ?? 0)}
            </Text>
          </Container.Card>
          <Container.Card className="flex-1">
            <Text variant="labelXS">Cancel Request</Text>
            <Text variant="headingXS">
              {formatNumber(summaryProcessSummary?.request_cancel ?? 0)}
            </Text>
          </Container.Card>
          <Container.Card className="flex-1">
            <Text variant="labelXS">Delivery Issue</Text>
            <Text variant="headingXS">
              {formatNumber(summaryProcessSummary?.delivery_issue ?? 0)}
            </Text>
          </Container.Card>
        </View>
      </View>
    </Container.Scroll>
  );
}
