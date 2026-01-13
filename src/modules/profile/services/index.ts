import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { profileEndpoints } from '../constants/endpoints';
import {
  ChatProfileResponse,
  ProfileResponse,
  UpdateAvailabilityPayload,
  UpdateAvailabilityResponse,
} from './types';

/**
 * Fetches profile information from the API.
 * @returns A promise that resolves to the profile information.
 */
export async function getProfile(): Promise<ProfileResponse> {
  const response = await API.get<SuccessResponse<ProfileResponse>>(
    profileEndpoints.profile,
  );

  return response.data.data;
}

export * from './types';

/**
 * Fetches the chat profile for the given account.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the chat profile.
 */
export async function getChatProfile(): Promise<ChatProfileResponse> {
  const response = await API.get<ChatProfileResponse>(
    profileEndpoints.chatProfile,
  );

  return response.data;
}

/**
 * Updates the availability status for the current user.
 * @param status - The new availability status.
 * @returns A promise that resolves to the updated availability.
 */
export async function updateAvailability(
  payload: UpdateAvailabilityPayload,
): Promise<UpdateAvailabilityResponse> {
  const response = await API.post<UpdateAvailabilityResponse>(
    profileEndpoints.availability,
    payload,
  );

  return response.data;
}
