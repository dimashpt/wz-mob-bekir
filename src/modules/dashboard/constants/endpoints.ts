/**
 * Dashboard API Endpoints
 */
export const dashboardEndpoints = {
  chartSummary: '/tenant/dashboard/get-chart-summary',
  chartRevenue: '/tenant/dashboard/get-chart-revenue',
  totalOrder: '/tenant/dashboard/get-order-total',
  marketplaceOrder: '/tenant/dashboard/get-order-marketplace',
  totalRevenue: '/tenant/dashboard/get-total-revenue',
  topProducts: '/tenant/dashboard/get-top-product',
  processSummary: '/tenant/dashboard/get-process-summary',
  marketplaceStatus: '/tenant/dashboard/get-status-marketplace',
  performanceSummary: '/tenant/dashboard/get-performance-summary',
} as const;
