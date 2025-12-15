import dayjs from 'dayjs';
import { lineDataItem } from 'react-native-gifted-charts';

import { DashboardPayload } from '@/modules/dashboard/services';
import {
  useChartRevenueQuery,
  useChartSummaryQuery,
  useOrderMarketplaceQuery,
  useOrderTotalQuery,
  usePerformanceSummaryQuery,
  useProcessSummaryQuery,
  useStatusMarketplaceQuery,
  useTotalRevenueQuery,
} from '@/modules/dashboard/services/repository';
import { StorePlatform } from '@/modules/orders/services/order';

interface ExtendedLineDataItem extends lineDataItem {
  date?: string;
}

interface DashboardStatsReturn {
  summaryChartOrder:
    | {
        mp: ExtendedLineDataItem[];
        soscom: ExtendedLineDataItem[];
      }
    | undefined;
  summaryOrder:
    | {
        total_order: number;
        total_order_marketplace: number;
        total_order_soscom: number;
      }
    | undefined;
  summaryMpOrder: Partial<Record<StorePlatform, number>> | undefined;
  summaryTotalRevenue:
    | {
        total_revenue: number;
        total_revenue_soscom: number;
        total_revenue_mp: number;
      }
    | undefined;
  summaryChartRevenue:
    | {
        mp: Array<{ value: number; label?: string; date?: string }>;
        soscom: Array<{ value: number; label?: string; date?: string }>;
      }
    | undefined;
  summaryStatusMarketplace:
    | Partial<
        Record<
          string,
          {
            store_group: string;
            success: number;
            on_delivery: number;
            on_process: number;
            return: number;
            cancel: number;
          }
        >
      >
    | undefined;
  summaryPerformanceSummary:
    | {
        on_sla: number;
        on_sla_rate: string;
        over_sla: number;
        over_sla_rate: string;
        delivery_success: number;
        delivery_success_rate: string;
        order_cancel: number;
        order_cancel_rate: string;
        order_return: number;
        order_return_rate: string;
      }
    | undefined;
  summaryProcessSummary:
    | {
        problem_process: number;
        request_cancel: number;
        delivery_issue: number;
      }
    | undefined;
  refetchAll: () => Promise<void>;
  isRefetching: boolean;
}

/**
 * Custom hook to fetch and map dashboard chart summary data.
 * Maps store groups (marketplace and soscom) to separate chart data arrays.
 * @param enabled - Whether to enable the query
 * @param payload - The payload containing date range for the request
 * @returns Object containing mapped chart data (data1 for marketplace, data2 for soscom) and loading state
 */
export function useDashboardStats(
  enabled: boolean,
  payload: DashboardPayload,
): DashboardStatsReturn {
  const {
    data: summaryChartOrder,
    refetch: refetchChartOrder,
    isRefetching: isRefetchingChartOrder,
  } = useChartSummaryQuery(
    {
      enabled,
      select: (data) => {
        const mp: ExtendedLineDataItem[] = [];
        const soscom: ExtendedLineDataItem[] = [];

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
            label: undefined,
            date: dayjs(item.date).format('D MMMM YYYY'),
          });
          soscom.push({
            value: soscomValue,
            label: undefined,
            date: dayjs(item.date).format('D MMMM YYYY'),
          });
        });

        return { mp, soscom };
      },
    },
    payload,
  );
  const {
    data: summaryOrder,
    refetch: refetchOrder,
    isRefetching: isRefetchingOrder,
  } = useOrderTotalQuery({ enabled }, payload);
  const {
    data: summaryMpOrder,
    refetch: refetchMpOrder,
    isRefetching: isRefetchingMpOrder,
  } = useOrderMarketplaceQuery(
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
  const {
    data: summaryChartRevenue,
    refetch: refetchChartRevenue,
    isRefetching: isRefetchingChartRevenue,
  } = useChartRevenueQuery(
    {
      enabled,
      select: (data) => {
        const mp: Array<{ value: number; label?: string; date?: string }> = [];
        const soscom: Array<{ value: number; label?: string; date?: string }> =
          [];

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
            label: undefined,
            date: dayjs(item.date).format('D MMMM YYYY'),
          });
          soscom.push({
            value: soscomValue,
            label: undefined,
            date: dayjs(item.date).format('D MMMM YYYY'),
          });
        });

        return { mp, soscom };
      },
    },
    payload,
  );
  const {
    data: summaryTotalRevenue,
    refetch: refetchTotalRevenue,
    isRefetching: isRefetchingTotalRevenue,
  } = useTotalRevenueQuery({ enabled }, payload);
  const {
    data: summaryStatusMarketplace,
    refetch: refetchStatusMarketplace,
    isRefetching: isRefetchingStatusMarketplace,
  } = useStatusMarketplaceQuery(
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

  const {
    data: summaryPerformanceSummary,
    refetch: refetchPerformanceSummary,
    isRefetching: isRefetchingPerformanceSummary,
  } = usePerformanceSummaryQuery({ enabled }, payload);

  const {
    data: summaryProcessSummary,
    refetch: refetchProcessSummary,
    isRefetching: isRefetchingProcessSummary,
  } = useProcessSummaryQuery({ enabled }, payload);

  // const { data: summaryTopProduct } = useTopProductQuery({ enabled }, payload);

  async function refetchAll(): Promise<void> {
    await Promise.all([
      refetchChartOrder(),
      refetchOrder(),
      refetchMpOrder(),
      refetchChartRevenue(),
      refetchTotalRevenue(),
      refetchStatusMarketplace(),
      refetchPerformanceSummary(),
      refetchProcessSummary(),
    ]);
  }

  const isRefetching =
    isRefetchingChartOrder ||
    isRefetchingOrder ||
    isRefetchingMpOrder ||
    isRefetchingChartRevenue ||
    isRefetchingTotalRevenue ||
    isRefetchingStatusMarketplace ||
    isRefetchingPerformanceSummary ||
    isRefetchingProcessSummary;

  return {
    summaryChartOrder,
    summaryOrder,
    summaryMpOrder,
    summaryTotalRevenue,
    summaryChartRevenue,
    summaryStatusMarketplace,
    summaryPerformanceSummary,
    summaryProcessSummary,
    refetchAll,
    isRefetching,
  };
}
