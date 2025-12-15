/**
 * Dashboard API Endpoints
 */
export const DASHBOARD_ENDPOINTS = {
  CHART_SUMMARY: '/tenant/dashboard/get-chart-summary',
  CHART_REVENUE: '/tenant/dashboard/get-chart-revenue',
  GET_ORDER_TOTAL: '/tenant/dashboard/get-order-total',
  GET_ORDER_MARKETPLACE: '/tenant/dashboard/get-order-marketplace',
  GET_TOTAL_REVENUE: '/tenant/dashboard/get-total-revenue',
  GET_TOP_PRODUCT: '/tenant/dashboard/get-top-product',
  GET_PROCESS_SUMMARY: '/tenant/dashboard/get-process-summary',
  GET_STATUS_MARKETPLACE: '/tenant/dashboard/get-status-marketplace',
  GET_PERFORMANCE_SUMMARY: '/tenant/dashboard/get-performance-summary',
} as const;
