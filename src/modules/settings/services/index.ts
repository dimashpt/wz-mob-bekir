import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { settingEndpoints } from '../constants/endpoints';
import {
  ListNotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
} from './types';

/**
 * Fetches notification settings from the API.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the profile information.
 */
export async function notificationSettingList(
  accountId: number,
): Promise<ListNotificationSettingsResponse> {
  const response = await API.get<ListNotificationSettingsResponse>(
    settingEndpoints.notifications(accountId),
  );

  return response.data;
}

/**
 * Updates notification settings for the given account.
 * @param accountId - The ID of the account.
 * @param payload - The notification settings to update.
 * @returns A promise that resolves to the updated notification settings.
 */
export async function updateNotificationSettings(
  accountId: number,
  payload: UpdateNotificationSettingsPayload,
): Promise<ListNotificationSettingsResponse> {
  const response = await API.put<
    SuccessResponse<ListNotificationSettingsResponse>
  >(settingEndpoints.notifications(accountId), payload);

  return response.data.data;
}
