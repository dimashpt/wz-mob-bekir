/**
 * Authentication API Endpoints
 */
export const authEndpoints = {
  login: '/auth/v1/login',
  logout: '/auth/v1/logout',
  forgotPassword: '/auth/v1/forgot-password',
  resetPassword: '/auth/v1/reset-password',
  refreshToken: '/auth/refresh-token',
  // Chat endpoints
  chatLogin: process.env.EXPO_PUBLIC_CHAT_BASE_URL + '/auth/sign_in',
} as const;
