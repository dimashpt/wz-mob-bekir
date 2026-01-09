import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { profileEndpoints } from '../constants/endpoints';
import {
  AvailabilityResponse,
  ChatProfileResponse,
  ProfileResponse,
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
 * Fetches the availability for the given account.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the availability.
 */
export async function getAvailability(): Promise<AvailabilityResponse> {
  const response = await API.get<AvailabilityResponse>(
    profileEndpoints.availability,
  );

  return response.data;
}
