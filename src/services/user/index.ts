import { SuccessResponse } from '@/@types/api';
import { USER_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { ProfileResponse } from './types';

/**
 * Fetches profile information from the API.
 * @returns A promise that resolves to the profile information.
 */
export async function getProfile(): Promise<ProfileResponse> {
  const response = await API.get<SuccessResponse<ProfileResponse>>(
    USER_ENDPOINTS.PROFILE,
  );

  return response.data.data;
}

export * from './types';
