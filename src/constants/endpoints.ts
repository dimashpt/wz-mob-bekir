/**
 * API Endpoints organized by service categories
 * This file centralizes all API endpoint strings used across the application
 */

const ENDPOINTS = {
  // Authentication endpoints
  AUTH_ENDPOINTS: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // User endpoints
  USER_ENDPOINTS: {
    GET_USER: '/user',
  },
} as const;

export default ENDPOINTS;

// Export individual service endpoints for convenience
export const { AUTH_ENDPOINTS, USER_ENDPOINTS } = ENDPOINTS;
