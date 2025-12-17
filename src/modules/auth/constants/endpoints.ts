/**
 * Authentication API Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/v1/login',
  LOGOUT: '/auth/v1/logout',
  FORGOT_PASSWORD: '/auth/v1/forgot-password',
  RESET_PASSWORD: '/auth/v1/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  CHAT_LOGIN: process.env.EXPO_PUBLIC_CHAT_BASE_URL + '/auth/sign_in',
} as const;
