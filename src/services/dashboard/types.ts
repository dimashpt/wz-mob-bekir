import { StorePlatform } from '../order';

type StoreGroup = 'marketplace' | 'soscom';

export interface DashboardPayload {
  date_from: string;
  date_to: string;
}

export type ChartSummaryResponse = Array<{
  date: string;
  data: Array<{
    store_group: StoreGroup;
    total_order: number;
  }>;
}>;

export type ChartRevenueResponse = Array<{
  date: string;
  data: Array<{
    store_group: StoreGroup;
    total_revenue: number;
  }>;
}>;

export interface OrderTotalResponse {
  total_order: number;
  total_order_marketplace: number;
  total_order_soscom: number;
}

export type OrderMarketplaceResponse = Array<{
  store_platform: StorePlatform;
  total_order: number;
}>;

export interface TotalRevenueResponse {
  total_revenue: number;
  total_revenue_soscom: number;
  total_revenue_mp: number;
}

export type TopProductResponse = Array<{
  sku: string;
  store_group: StoreGroup;
  total_quantity: number;
}>;

export interface ProcessSummaryResponse {
  problem_process: number;
  request_cancel: number;
  delivery_issue: number;
}

export type MarketplaceStatusResponse = Array<{
  store_group: StoreGroup;
  success: number;
  on_delivery: number;
  on_process: number;
  return: number;
  cancel: number;
}>;

export interface PerformanceSummaryResponse {
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
