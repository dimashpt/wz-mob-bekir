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

  // User endpoints
  USER_ENDPOINTS: {
    GET_USER: '/user',
  },

  // Order endpoints
  ORDER_ENDPOINTS: {
    LIST_ORDERS: '/tenant/orders',
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
} as const;

export default ENDPOINTS;

// Export individual service endpoints for convenience
export const {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  ORDER_ENDPOINTS,
  STORE_ENDPOINTS,
  WAREHOUSE_ENDPOINTS,
} = ENDPOINTS;
