import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { DASHBOARD_ENDPOINTS } from '@/constants/endpoints';
import * as DashboardService from './index';
import {
  ChartRevenueResponse,
  ChartSummaryResponse,
  DashboardPayload,
  MarketplaceStatusResponse,
  OrderMarketplaceResponse,
  OrderTotalResponse,
  PerformanceSummaryResponse,
  ProcessSummaryResponse,
  TopProductResponse,
  TotalRevenueResponse,
} from './types';

/**
 * Custom hook to fetch chart summary data.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing chart summary data.
 * @template T - The type of data returned after selection (defaults to ChartSummaryResponse).
 */
export function useChartSummaryQuery<T = ChartSummaryResponse>(
  params: Omit<
    UseQueryOptions<ChartSummaryResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<ChartSummaryResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.CHART_SUMMARY, payload],
    queryFn: () => DashboardService.getChartSummary(payload),
  });

  return query;
}

/**
 * Custom hook to fetch chart revenue data.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing chart revenue data.
 * @template T - The type of data returned after selection (defaults to ChartRevenueResponse).
 */
export function useChartRevenueQuery<T = ChartRevenueResponse>(
  params: Omit<
    UseQueryOptions<ChartRevenueResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<ChartRevenueResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.CHART_REVENUE, payload],
    queryFn: () => DashboardService.getChartRevenue(payload),
  });

  return query;
}

/**
 * Custom hook to fetch order total summary.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing order total summary.
 * @template T - The type of data returned after selection (defaults to OrderTotalResponse).
 */
export function useOrderTotalQuery<T = OrderTotalResponse>(
  params: Omit<
    UseQueryOptions<OrderTotalResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<OrderTotalResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_ORDER_TOTAL, payload],
    queryFn: () => DashboardService.getOrderTotal(payload),
  });

  return query;
}

/**
 * Custom hook to fetch order breakdown by marketplace platform.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing order marketplace data.
 * @template T - The type of data returned after selection (defaults to OrderMarketplaceResponse).
 */
export function useOrderMarketplaceQuery<T = OrderMarketplaceResponse>(
  params: Omit<
    UseQueryOptions<OrderMarketplaceResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<OrderMarketplaceResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_ORDER_MARKETPLACE, payload],
    queryFn: () => DashboardService.getOrderMarketplace(payload),
  });

  return query;
}

/**
 * Custom hook to fetch total revenue summary.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing total revenue data.
 * @template T - The type of data returned after selection (defaults to TotalRevenueResponse).
 */
export function useTotalRevenueQuery<T = TotalRevenueResponse>(
  params: Omit<
    UseQueryOptions<TotalRevenueResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<TotalRevenueResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_TOTAL_REVENUE, payload],
    queryFn: () => DashboardService.getTotalRevenue(payload),
  });

  return query;
}

/**
 * Custom hook to fetch top products data.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing top products data.
 * @template T - The type of data returned after selection (defaults to TopProductResponse).
 */
export function useTopProductQuery<T = TopProductResponse>(
  params: Omit<
    UseQueryOptions<TopProductResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<TopProductResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_TOP_PRODUCT, payload],
    queryFn: () => DashboardService.getTopProduct(payload),
  });

  return query;
}

/**
 * Custom hook to fetch process summary data.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing process summary data.
 * @template T - The type of data returned after selection (defaults to ProcessSummaryResponse).
 */
export function useProcessSummaryQuery<T = ProcessSummaryResponse>(
  params: Omit<
    UseQueryOptions<ProcessSummaryResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<ProcessSummaryResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_PROCESS_SUMMARY, payload],
    queryFn: () => DashboardService.getProcessSummary(payload),
  });

  return query;
}

/**
 * Custom hook to fetch marketplace status breakdown.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing marketplace status data.
 * @template T - The type of data returned after selection (defaults to MarketplaceStatusResponse).
 */
export function useStatusMarketplaceQuery<T = MarketplaceStatusResponse>(
  params: Omit<
    UseQueryOptions<MarketplaceStatusResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<MarketplaceStatusResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_STATUS_MARKETPLACE, payload],
    queryFn: () => DashboardService.getStatusMarketplace(payload),
  });

  return query;
}

/**
 * Custom hook to fetch performance summary data.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload containing date range for the request.
 * @returns The query object containing performance summary data.
 * @template T - The type of data returned after selection (defaults to PerformanceSummaryResponse).
 */
export function usePerformanceSummaryQuery<T = PerformanceSummaryResponse>(
  params: Omit<
    UseQueryOptions<PerformanceSummaryResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  payload: DashboardPayload,
): UseQueryResult<T, Error> {
  const query = useQuery<PerformanceSummaryResponse, Error, T>({
    ...params,
    queryKey: [DASHBOARD_ENDPOINTS.GET_PERFORMANCE_SUMMARY, payload],
    queryFn: () => DashboardService.getPerformanceSummary(payload),
  });

  return query;
}
