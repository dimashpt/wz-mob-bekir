import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { dashboardEndpoints } from '../constants/endpoints';
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
    dashboardEndpoints.chartSummary,
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
    dashboardEndpoints.chartRevenue,
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
    dashboardEndpoints.totalOrder,
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
    dashboardEndpoints.marketplaceOrder,
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
    dashboardEndpoints.totalRevenue,
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
    dashboardEndpoints.topProducts,
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
    dashboardEndpoints.processSummary,
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
    dashboardEndpoints.marketplaceStatus,
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
    dashboardEndpoints.performanceSummary,
    payload,
  );

  return response.data.data;
}

export * from './types';
