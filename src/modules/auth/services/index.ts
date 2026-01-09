import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { useAuthStore } from '@/store';
import { authEndpoints } from '../constants/endpoints';
import {
  ChatLoginPayload,
  ChatLoginResponse,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
} from './types';

/**
 * Logs in a user using the provided credentials.
 * @param payload - The login credentials.
 * @returns The response containing user information.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await API.post<SuccessResponse<LoginResponse>>(
    authEndpoints.login,
    payload,
  );

  return response.data.data;
}

/**
 * Logs out the current user.
 * @returns A promise that resolves when the logout is successful.
 */
export async function logout(): Promise<void> {
  const response = await API.post<SuccessResponse<void>>(authEndpoints.logout);

  return response.data.data;
}

/**
 * Refreshes the user's access token.
 * @returns The response containing the new access token and user information.
 */
export async function refreshToken(): Promise<LoginResponse> {
  const refreshToken = useAuthStore.getState().token?.refreshToken;

  const response = await API.post<SuccessResponse<LoginResponse>>(
    authEndpoints.refreshToken,
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
    authEndpoints.forgotPassword,
    payload,
  );

  return response.data.data;
}

/**
 * Resets the user's password.
 * @param payload - The payload for the reset password request.
 * @returns A promise that resolves when the reset password request is successful.
 */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  const response = await API.post<SuccessResponse<void>>(
    authEndpoints.resetPassword,
    payload,
  );

  return response.data.data;
}

/**
 * Login to Chat
 */
export async function loginChat(
  payload: ChatLoginPayload,
): Promise<ChatLoginResponse> {
  const response = await API.post<ChatLoginResponse>(
    authEndpoints.chatLogin,
    payload,
  );

  const finalResponse: ChatLoginResponse = {
    mfa_required: response.data.mfa_required,
    mfa_token: response.data.mfa_token,
    data: response.data.data,
    headers: {
      'access-token': response.headers['access-token'],
      client: response.headers['client'],
      uid: response.headers['uid'],
    },
  };

  return finalResponse;
}

export * from './types';
