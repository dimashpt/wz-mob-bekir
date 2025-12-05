import React, { JSX, useState } from 'react';
import { BackHandler, View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
import { Image as ExpoImage } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import { Container, Icon, SelectDateTime, Text } from '@/components';
import { ORDER_STORE_PLATFORMS_LOGOS } from '@/constants/order';
import { useNotification } from '@/hooks';
import { DashboardPayload } from '@/services/dashboard';
import { StorePlatform } from '@/services/order';
import { formatNumber } from '@/utils/formatter';
import { useDashboardStats } from './hooks/use-dashboard-stats';

const Image = withUniwind(ExpoImage);

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
  const { summaryChartData, summaryOrder, summaryMpOrder } = useDashboardStats(
    fetchEnabled,
    payload,
  );

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
    <Container
      className="bg-background p-lg gap-md flex-1"
      style={{
        paddingTop: insets.top + 20,
      }}
    >
      <Text variant="headingL">{t('home.title')}</Text>
      <SelectDateTime
        placeholder="Select Period"
        mode="date-range"
        enableRange
        onRangeSelect={setRange}
      />
      <View className="flex-1">
        <Container.Card className="gap-lg shrink overflow-hidden">
          <View className="flex-row items-center justify-between">
            <View className="gap-xs flex-row items-center">
              <Icon name="order" className="text-foreground" size={24} />
              <Text variant="headingXS">Order Summary</Text>
            </View>
            <Text variant="labelM">
              {formatNumber(summaryOrder?.total_order ?? 0)} Orders
            </Text>
          </View>
          <LineChart
            endSpacing={0}
            areaChart
            curved
            data={summaryChartData.mp}
            data2={summaryChartData.soscom}
            hideDataPoints
            // spacing={12}
            color1="#FFAF13"
            color2="#42B8D5"
            startFillColor1="#FFAF13"
            startFillColor2="#42B8D5"
            endFillColor1="#FFAF13"
            endFillColor2="#42B8D5"
            startOpacity={0.5}
            endOpacity={0}
            isAnimated
            initialSpacing={0}
            noOfSections={4}
            yAxisColor="white"
            yAxisThickness={0}
            // rulesType="solid"
            // rulesColor="transparent"
            // yAxisTextStyle={{ color: 'gray' }}
            xAxisColor="transparent"
            // pointerConfig={{
            //   pointerStripUptoDataPoint: true,
            //   pointerStripColor: 'black',
            //   pointerStripWidth: 2,
            //   strokeDashArray: [2, 5],
            //   pointerColor: 'black',
            //   radius: 4,
            //   pointerLabelWidth: 100,
            //   pointerLabelHeight: 120,
            // }}
          />
          <View className="gap-md flex-row items-center">
            <View className="gap-xs flex-row items-center">
              <View className="size-2 rounded-full bg-[#FFAF13]" />
              <Text variant="labelXS" color="muted">
                Marketplace
              </Text>
            </View>
            <View className="gap-xs flex-row items-center">
              <View className="size-2 rounded-full bg-[#42B8D5]" />
              <Text variant="labelXS" color="muted">
                Soscom
              </Text>
            </View>
          </View>
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
      </View>
    </Container>
  );
}
