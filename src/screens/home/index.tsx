import React, { JSX, useState } from 'react';
import { BackHandler, View } from 'react-native';

import dayjs, { Dayjs } from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Container, SelectDateTime, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useNotification } from '@/hooks';
import { DashboardPayload } from '@/services/dashboard';
import {
  OrderSummary,
  PerformanceSummary,
  ProcessSummary,
  RevenueSummary,
  StatusSummary,
} from './components';
import { useDashboardStats } from './hooks/use-dashboard-stats';

export default function HomeScreen(): JSX.Element {
  const { t } = useTranslation();
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
    <Container className="pt-safe">
      <Container.Scroll
        className="bg-background"
        contentContainerClassName="p-lg gap-md"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
      >
        <Text variant="headingL">{t('home.title')}</Text>
        <SelectDateTime
          placeholder={t('home.select_period')}
          mode="date-range"
          className="bg-surface"
          onChange={setRange}
          value={range}
        />
        <View className="gap-md flex-1">
          <RevenueSummary
            range={[payload.date_from, payload.date_to].join('~')}
            summaryTotalRevenue={summaryTotalRevenue}
            summaryChartRevenue={summaryChartRevenue}
          />
          <OrderSummary
            range={[payload.date_from, payload.date_to].join('~')}
            summaryOrder={summaryOrder}
            summaryChartOrder={summaryChartOrder}
            summaryMpOrder={summaryMpOrder}
          />
          <View className="gap-md flex-row">
            <StatusSummary
              summaryStatusMarketplace={summaryStatusMarketplace}
            />
            <PerformanceSummary
              summaryPerformanceSummary={summaryPerformanceSummary}
            />
          </View>
          <ProcessSummary summaryProcessSummary={summaryProcessSummary} />
        </View>
      </Container.Scroll>
    </Container>
  );
}
