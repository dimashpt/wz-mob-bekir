import { SuccessResponse } from '@/@types/api';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { useAuthStore } from '@/store';
import { ForgotPasswordPayload, LoginPayload, LoginResponse } from './types';

/**
 * Logs in a user using the provided credentials.
 * @param payload - The login credentials.
 * @returns The response containing user information.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await API.post<SuccessResponse<LoginResponse>>(
    AUTH_ENDPOINTS.LOGIN,
    payload,
  );

  return response.data.data;
}

/**
 * Logs out the current user.
 * @returns A promise that resolves when the logout is successful.
 */
export async function logout(): Promise<void> {
  const response = await API.post<SuccessResponse<void>>(
    AUTH_ENDPOINTS.LOGOUT,
    {},
  );

  return response.data.data;
}

/**
 * Refreshes the user's access token.
 * @returns The response containing the new access token and user information.
 */
export async function refreshToken(): Promise<LoginResponse> {
  const refreshToken = useAuthStore.getState().token?.refreshToken;

  const response = await API.post<SuccessResponse<LoginResponse>>(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    { refresh_token: refreshToken },
  );

  return response.data.data;
}

/**
 * Forgets the user's password.
 * @param payload - The payload for the forgot password request.
 * @returns A promise that resolves when the forgot password request is successful.
 */
export async function forgotPassword(
  payload: Pick<ForgotPasswordPayload, 'email'>,
): Promise<void> {
  const response = await API.post<SuccessResponse<void>>(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload,
  );

  return response.data.data;
}

export * from './types';
