import dayjs from 'dayjs';

import { DashboardPayload } from '@/services/dashboard';
import {
  useChartRevenueQuery,
  useChartSummaryQuery,
  useOrderMarketplaceQuery,
  useOrderTotalQuery,
  usePerformanceSummaryQuery,
  useStatusMarketplaceQuery,
  useTotalRevenueQuery,
} from '@/services/dashboard/repository';
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
  const { data: summaryChartOrder } = useChartSummaryQuery(
    {
      enabled,
      select: (data) => {
        const mp: Array<{ value: number; label?: string }> = [];
        const soscom: Array<{ value: number; label?: string }> = [];

        data.forEach((item) => {
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
      },
    },
    payload,
  );
  const { data: summaryOrder } = useOrderTotalQuery({ enabled }, payload);
  const { data: summaryMpOrder } = useOrderMarketplaceQuery(
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
  const { data: summaryChartRevenue } = useChartRevenueQuery(
    {
      enabled,
      select: (data) => {
        const mp: Array<{ value: number; label?: string }> = [];
        const soscom: Array<{ value: number; label?: string }> = [];

        data.forEach((item) => {
          let marketplaceValue = 0;
          let soscomValue = 0;

          if (item.data && item.data.length > 0) {
            const marketplaceData = item.data.find(
              (store) => store.store_group === 'marketplace',
            );
            const soscomData = item.data.find(
              (store) => store.store_group === 'soscom',
            );

            marketplaceValue = marketplaceData?.total_revenue || 0;
            soscomValue = soscomData?.total_revenue || 0;
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
      },
    },
    payload,
  );
  const { data: summaryTotalRevenue } = useTotalRevenueQuery(
    { enabled },
    payload,
  );
  const { data: summaryStatusMarketplace } = useStatusMarketplaceQuery(
    {
      enabled,
      select: (data) => {
        const mappedData: Partial<
          Record<(typeof data)[number]['store_group'], (typeof data)[number]>
        > = {};

        data.forEach((item) => {
          mappedData[item.store_group] = item;
        });

        return mappedData;
      },
    },
    payload,
  );

  const { data: summaryPerformanceSummary } = usePerformanceSummaryQuery(
    { enabled },
    payload,
  );

  // const { data: summaryTopProduct } = useTopProductQuery({ enabled }, payload);
  // const { data: summaryProcessSummary } = useProcessSummaryQuery({ enabled }, payload);

  return {
    summaryChartOrder,
    summaryOrder,
    summaryMpOrder,
    summaryTotalRevenue,
    summaryChartRevenue,
    summaryStatusMarketplace,
    summaryPerformanceSummary,
  };
}
