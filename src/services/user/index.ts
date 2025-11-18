import { SuccessResponse } from '@/@types/api';
import { USER_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { UserInfo } from './types';

/**
 * Fetches user information from the API.
 * @returns A promise that resolves to the user information.
 */
export async function getUser(): Promise<UserInfo> {
  const response = await API.get<SuccessResponse<UserInfo>>(
    USER_ENDPOINTS.GET_USER,
    {
      baseURL: process.env.EXPO_PUBLIC_API_SSO_URL,
    },
  );

  return response.data.data;
}

export * from './types';
