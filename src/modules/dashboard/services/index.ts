import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { DASHBOARD_ENDPOINTS } from '../constants/endpoints';
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
 * Fetches chart summary data from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the chart summary data.
 */
export async function getChartSummary(
  payload: DashboardPayload,
): Promise<ChartSummaryResponse> {
  const response = await API.post<SuccessResponse<ChartSummaryResponse>>(
    DASHBOARD_ENDPOINTS.CHART_SUMMARY,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches chart revenue data from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the chart revenue data.
 */
export async function getChartRevenue(
  payload: DashboardPayload,
): Promise<ChartRevenueResponse> {
  const response = await API.post<SuccessResponse<ChartRevenueResponse>>(
    DASHBOARD_ENDPOINTS.CHART_REVENUE,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches order total summary from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the order total summary.
 */
export async function getOrderTotal(
  payload: DashboardPayload,
): Promise<OrderTotalResponse> {
  const response = await API.post<SuccessResponse<OrderTotalResponse>>(
    DASHBOARD_ENDPOINTS.GET_ORDER_TOTAL,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches order breakdown by marketplace platform from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the order marketplace data.
 */
export async function getOrderMarketplace(
  payload: DashboardPayload,
): Promise<OrderMarketplaceResponse> {
  const response = await API.post<SuccessResponse<OrderMarketplaceResponse>>(
    DASHBOARD_ENDPOINTS.GET_ORDER_MARKETPLACE,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches total revenue summary from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the total revenue data.
 */
export async function getTotalRevenue(
  payload: DashboardPayload,
): Promise<TotalRevenueResponse> {
  const response = await API.post<SuccessResponse<TotalRevenueResponse>>(
    DASHBOARD_ENDPOINTS.GET_TOTAL_REVENUE,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches top products data from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the top products data.
 */
export async function getTopProduct(
  payload: DashboardPayload,
): Promise<TopProductResponse> {
  const response = await API.post<SuccessResponse<TopProductResponse>>(
    DASHBOARD_ENDPOINTS.GET_TOP_PRODUCT,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches process summary data from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the process summary data.
 */
export async function getProcessSummary(
  payload: DashboardPayload,
): Promise<ProcessSummaryResponse> {
  const response = await API.post<SuccessResponse<ProcessSummaryResponse>>(
    DASHBOARD_ENDPOINTS.GET_PROCESS_SUMMARY,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches marketplace status breakdown from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the marketplace status data.
 */
export async function getStatusMarketplace(
  payload: DashboardPayload,
): Promise<MarketplaceStatusResponse> {
  const response = await API.post<SuccessResponse<MarketplaceStatusResponse>>(
    DASHBOARD_ENDPOINTS.GET_STATUS_MARKETPLACE,
    payload,
  );

  return response.data.data;
}

/**
 * Fetches performance summary data from the API.
 * @param payload - The payload containing date range for the request.
 * @returns A promise that resolves to the performance summary data.
 */
export async function getPerformanceSummary(
  payload: DashboardPayload,
): Promise<PerformanceSummaryResponse> {
  const response = await API.post<SuccessResponse<PerformanceSummaryResponse>>(
    DASHBOARD_ENDPOINTS.GET_PERFORMANCE_SUMMARY,
    payload,
  );

  return response.data.data;
}

export * from './types';
