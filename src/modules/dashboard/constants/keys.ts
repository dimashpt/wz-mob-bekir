import { DashboardPayload } from '../services/types';

export const dashboardKeys = {
  chartSummary: (payload: DashboardPayload) => [
    'dashboard-chart-summary',
    payload,
  ],
  chartRevenue: (payload: DashboardPayload) => [
    'dashboard-chart-revenue',
    payload,
  ],
  totalOrder: (payload: DashboardPayload) => ['dashboard-total-order', payload],
  marketplaceOrder: (payload: DashboardPayload) => [
    'dashboard-marketplace-order',
    payload,
  ],
  totalRevenue: (payload: DashboardPayload) => [
    'dashboard-total-revenue',
    payload,
  ],
  topProducts: (payload: DashboardPayload) => [
    'dashboard-top-products',
    payload,
  ],
  processSummary: (payload: DashboardPayload) => [
    'dashboard-process-summary',
    payload,
  ],
  marketplaceStatus: (payload: DashboardPayload) => [
    'dashboard-marketplace-status',
    payload,
  ],
  performanceSummary: (payload: DashboardPayload) => [
    'dashboard-performance-summary',
    payload,
  ],
};
