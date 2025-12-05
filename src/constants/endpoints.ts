/**
 * API Endpoints organized by service categories
 * This file centralizes all API endpoint strings used across the application
 */

const ENDPOINTS = {
  // Authentication endpoints
  AUTH_ENDPOINTS: {
    LOGIN: '/auth/v1/login',
    LOGOUT: '/auth/v1/logout',
    FORGOT_PASSWORD: '/auth/v1/forgot-password',
    RESET_PASSWORD: '/auth/v1/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  DASHBOARD_ENDPOINTS: {
    CHART_SUMMARY: '/tenant/dashboard/get-chart-summary',
    CHART_REVENUE: '/tenant/dashboard/get-chart-revenue',
    GET_ORDER_TOTAL: '/tenant/dashboard/get-order-total',
    GET_ORDER_MARKETPLACE: '/tenant/dashboard/get-order-marketplace',
    GET_TOTAL_REVENUE: '/tenant/dashboard/get-total-revenue',
    GET_TOP_PRODUCT: '/tenant/dashboard/get-top-product',
    GET_PROCESS_SUMMARY: '/tenant/dashboard/get-process-summary',
    GET_STATUS_MARKETPLACE: '/tenant/dashboard/get-status-marketplace',
    GET_PERFORMANCE_SUMMARY: '/tenant/dashboard/get-performance-summary',
  },

  // User endpoints
  USER_ENDPOINTS: {
    GET_USER: '/user',
  },

  // Order endpoints
  ORDER_ENDPOINTS: {
    LIST_ORDERS: '/tenant/orders',
    CREATE_ORDER: '/tenant/orders',
    GET_ORDER_DETAILS: '/tenant/orders/:id',
    GET_ORDER_HISTORIES: '/tenant/orders/:id/order-histories',
    GET_ORDER_HISTORY_DETAILS: '/tenant/orders/:id/order-histories',
    GET_ADDRESS: '/tenant/region/destinations/search',
  },

  // Store endpoints
  STORE_ENDPOINTS: {
    LIST_STORES: '/tenant/store',
  },

  WAREHOUSE_ENDPOINTS: {
    LIST_WAREHOUSES: '/tenant/location',
  },

  PRODUCT_ENDPOINTS: {
    LIST_PRODUCTS: '/tenant/products',
  },

  SHIPMENT_ENDPOINTS: {
    LIST_LOGISTICS: '/tenant/settings/logistics',
  },
} as const;

export default ENDPOINTS;

// Export individual service endpoints for convenience
export const {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  ORDER_ENDPOINTS,
  STORE_ENDPOINTS,
  WAREHOUSE_ENDPOINTS,
  PRODUCT_ENDPOINTS,
  SHIPMENT_ENDPOINTS,
  DASHBOARD_ENDPOINTS,
} = ENDPOINTS;
