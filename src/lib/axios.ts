import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { ErrorResponse } from '@/@types/api';
import { LoginResponse } from '@/modules/auth/services';
import { AuthStore } from '@/store';
import { handleMutationError } from '@/utils/error-handler';

// Global variables for refresh token management
let isRefreshingToken = false;
let refreshTokenPromise: Promise<string> | null = null;

// Request deduplication and rate limiting
const pendingRequests = new Map<string, Promise<AxiosResponse>>();
const requestTimestamps = new Map<string, number>();
const RATE_LIMIT_WINDOW = 1000; // 1 second

export const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 10_000),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  transitional: {
    // throw ETIMEDOUT error instead of generic ECONNABORTED on request timeouts
    clarifyTimeoutError: true,
  },
});

// Helper function to generate request key for deduplication
function generateRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url, params, data } = config;
  return `${method?.toUpperCase()}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
}

// Helper function to check rate limiting
function isRateLimited(requestKey: string): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(requestKey) || 0;

  // Clean old timestamps
  if (now - timestamps > RATE_LIMIT_WINDOW) {
    requestTimestamps.delete(requestKey);
    return false;
  }

  return false; // For now, we'll focus on deduplication rather than hard rate limiting
}

// Helper function to clean up completed requests
function cleanupRequest(requestKey: string): void {
  pendingRequests.delete(requestKey);
  // Keep timestamp for rate limiting
  requestTimestamps.set(requestKey, Date.now());
}

// Initialize interceptors (will be set up properly when auth store is available)
let authStoreInitialized = false;

export function initializeAuthInterceptors(
  getAuthState: () => AuthStore,
  refreshTokenFn: () => Promise<LoginResponse>,
): void {
  if (authStoreInitialized) return;
  authStoreInitialized = true;

  // Helper function to refresh access token
  async function refreshAccessToken(): Promise<string> {
    const { token, logout } = getAuthState();

    if (!token?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const refreshedData = await refreshTokenFn();
      return refreshedData.auth_token;
    } catch (error) {
      // If refresh fails, sign out the user
      logout();
      handleMutationError(error);
      throw error;
    }
  }

  // Request interceptor to add authorization header and security features
  API.interceptors.request.use(
    (config) => {
      // Generate request key for deduplication
      const requestKey = generateRequestKey(config);

      // Check if this exact request is already pending
      if (pendingRequests.has(requestKey)) {
        // Return the existing promise instead of making a new request
        throw new axios.Cancel(`Duplicate request cancelled: ${requestKey}`);
      }

      // Check rate limiting (optional - currently disabled)
      if (isRateLimited(requestKey)) {
        throw new axios.Cancel(`Rate limited: ${requestKey}`);
      }

      const { token, user } = getAuthState();

      if (token?.accessToken) {
        // Token is expired or invalid - attempt refresh instead of logout
        // This will be handled by the 401 response interceptor
        config.headers['Authorization'] = `Bearer ${token.accessToken}`;
        config.headers['X-Tenant-Id'] = user?.tenant_id;
      }

      // Add security headers
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['X-Content-Type-Options'] = 'nosniff';

      // Add request timestamp for replay attack prevention
      config.headers['X-Timestamp'] = Date.now().toString();

      // Store request key for deduplication tracking in headers
      config.headers['X-Request-Key'] = requestKey;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor to handle token refresh and errors
  API.interceptors.response.use(
    (response: AxiosResponse) => {
      // Clean up request tracking
      const requestKey = response.config?.headers?.['X-Request-Key'] as string;
      if (requestKey) {
        cleanupRequest(requestKey);
      }

      /**
       * Sometimes, the API returns success: false even when the response is 2xx.
       * This is a workaround to handle that case. I have no idea what were backend doing :/
       */
      if (response?.data?.success === false) {
        const error = new AxiosError(
          response.data.message,
          'ERR_BAD_REQUEST',
          response.config,
          response.request,
          response,
        );

        return Promise.reject(error);
      }

      return response;
    },
    async (error: AxiosError) => {
      // Clean up request tracking for errors too
      const requestKey = error.config?.headers?.['X-Request-Key'] as string;
      const errorResponse = error.response?.data as ErrorResponse<{
        force_logout?: boolean;
      }>;

      if (requestKey) {
        cleanupRequest(requestKey);
      }

      const { logout } = getAuthState();
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        logout();
        handleMutationError(error);

        // Disable refresh token logic, due to unavailable refresh token endpoint
        return Promise.reject(error);

        originalRequest._retry = true;

        if (errorResponse?.data?.force_logout) {
          logout();
          handleMutationError(error);
          return Promise.reject(error);
        }

        try {
          // Check if refresh token request is failing
          if (originalRequest.url?.includes('refresh-token')) {
            logout();
            return Promise.reject(error);
          }

          // Wait if token refresh is already in progress
          if (isRefreshingToken && refreshTokenPromise) {
            await refreshTokenPromise;
          } else if (!isRefreshingToken) {
            // Start token refresh process
            isRefreshingToken = true;
            refreshTokenPromise = refreshAccessToken();

            try {
              await refreshTokenPromise;
            } finally {
              isRefreshingToken = false;
              refreshTokenPromise = null;
            }
          }

          // Retry the original request with new token
          const { token } = getAuthState();

          if (token?.accessToken && originalRequest.headers) {
            originalRequest.headers['Authorization'] =
              `Bearer ${token?.accessToken ?? ''}`;
          }

          return API(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
}
