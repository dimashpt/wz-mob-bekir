import React, { JSX, useState } from 'react';
import { BackHandler, View } from 'react-native';

import { Dayjs } from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, SelectDateTime, Text } from '@/components';
import { useNotification } from '@/hooks';
import { DashboardRepo } from '@/services';
import { DashboardPayload } from '@/services/dashboard';

export default function HomeScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<{ start: Dayjs; end: Dayjs } | null>(null);

  // Setup notification
  useNotification();

  const fetchEnabled = Boolean(range);
  const payload: DashboardPayload = {
    date_from: range?.start ? range?.start?.format('YYYY-MM-DD') : '',
    date_to: range?.end ? range?.end?.format('YYYY-MM-DD') : '',
  };

  // Dashboard queries
  DashboardRepo.useChartSummaryQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useChartRevenueQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useOrderTotalQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useOrderMarketplaceQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useTotalRevenueQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useTopProductQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useProcessSummaryQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.useStatusMarketplaceQuery({ enabled: fetchEnabled }, payload);
  DashboardRepo.usePerformanceSummaryQuery({ enabled: fetchEnabled }, payload);

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
      <View className="bg-surface p-md flex-1 items-center justify-center rounded-md">
        <Text variant="labelM">{t('home.title')}</Text>
      </View>
    </Container>
  );
}
