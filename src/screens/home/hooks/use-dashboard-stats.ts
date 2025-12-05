import { useMemo } from 'react';

import dayjs from 'dayjs';

import { DashboardRepo } from '@/services';
import { DashboardPayload } from '@/services/dashboard';
import { StorePlatform } from '@/services/order';

interface DashboardStatsData {
  summaryChartData: {
    mp: Array<{ value: number; label?: string }>;
    soscom: Array<{ value: number; label?: string }>;
  };
}

/**
 * Custom hook to fetch and map dashboard chart summary data.
 * Maps store groups (marketplace and soscom) to separate chart data arrays.
 * @param enabled - Whether to enable the query
 * @param payload - The payload containing date range for the request
 * @returns Object containing mapped chart data (data1 for marketplace, data2 for soscom) and loading state
 */
export function useDashboardStats(enabled: boolean, payload: DashboardPayload) {
  const summaryChartQuery = DashboardRepo.useChartSummaryQuery(
    { enabled },
    payload,
  );
  const { data: summaryOrder } = DashboardRepo.useOrderTotalQuery(
    { enabled },
    payload,
  );
  const { data: summaryMpOrder } = DashboardRepo.useOrderMarketplaceQuery(
    {
      enabled,
      select: (data) => {
        const summary: Partial<Record<StorePlatform, number>> = {};

        data.forEach((item) => {
          summary[item.store_platform] = item.total_order;
        });

        return summary;
      },
    },
    payload,
  );
  // DashboardRepo.useChartSummaryQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.useChartRevenueQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.useOrderMarketplaceQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.useTotalRevenueQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.useTopProductQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.useProcessSummaryQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.useStatusMarketplaceQuery({ enabled: fetchEnabled }, payload);
  // DashboardRepo.usePerformanceSummaryQuery({ enabled: fetchEnabled }, payload);

  const summaryChartData = useMemo<
    DashboardStatsData['summaryChartData']
  >(() => {
    if (!summaryChartQuery?.data || summaryChartQuery?.data.length === 0) {
      return { mp: [], soscom: [] };
    }

    const mp: Array<{ value: number; label?: string }> = [];
    const soscom: Array<{ value: number; label?: string }> = [];

    summaryChartQuery?.data.forEach((item) => {
      let marketplaceValue = 0;
      let soscomValue = 0;

      if (item.data && item.data.length > 0) {
        const marketplaceData = item.data.find(
          (store) => store.store_group === 'marketplace',
        );
        const soscomData = item.data.find(
          (store) => store.store_group === 'soscom',
        );

        marketplaceValue = marketplaceData?.total_order || 0;
        soscomValue = soscomData?.total_order || 0;
      }

      mp.push({
        value: marketplaceValue,
        label: dayjs(item.date).format('D MMM'),
      });
      soscom.push({
        value: soscomValue,
        label: dayjs(item.date).format('D MMM'),
      });
    });

    return { mp, soscom };
  }, [summaryChartQuery.data]);

  return { summaryChartData, summaryOrder, summaryMpOrder };
}
