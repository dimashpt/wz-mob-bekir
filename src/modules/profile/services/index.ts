import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { userEndpoints } from '../constants/endpoints';
import { ProfileResponse } from './types';

/**
 * Fetches profile information from the API.
 * @returns A promise that resolves to the profile information.
 */
export async function getProfile(): Promise<ProfileResponse> {
  const response = await API.get<SuccessResponse<ProfileResponse>>(
    userEndpoints.profile,
  );

  return response.data.data;
}

export * from './types';
