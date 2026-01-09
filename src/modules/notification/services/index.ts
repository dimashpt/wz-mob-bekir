import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { notificationEndpoints } from '../constants/endpoints';
import {
  ListNotificationParams,
  ListNotificationResponse,
  Notification,
} from './types';

/**
 * Fetches profile information from the API.
 * @returns A promise that resolves to the profile information.
 */
export async function notificationList(
  accountId: number,
  params: ListNotificationParams,
): Promise<ListNotificationResponse> {
  const response = await API.get<SuccessResponse<ListNotificationResponse>>(
    notificationEndpoints.list(accountId),
    { params },
  );

  return response.data.data;
}

/**
 * Reads all notifications for the given account.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the success response.
 */
export async function readAllNotifications(
  accountId: number,
): Promise<SuccessResponse<void>> {
  const response = await API.post<SuccessResponse<void>>(
    notificationEndpoints.readAll(accountId),
  );

  return response.data;
}

/**
 * Marks a notification as unread for the given account.
 * @param accountId - The ID of the account.
 * @param notificationId - The ID of the notification.
 * @returns A promise that resolves to the success response.
 */
export async function unreadNotification(
  accountId: number,
  notificationId: number,
): Promise<SuccessResponse<Notification>> {
  const response = await API.post<SuccessResponse<Notification>>(
    notificationEndpoints.unread(accountId, notificationId),
  );

  return response.data;
}

/**
 * Deletes a notification for the given account.
 * @param accountId - The ID of the account.
 * @param notificationId - The ID of the notification.
 * @returns A promise that resolves to the success response.
 */
export async function deleteNotification(
  accountId: number,
  notificationId: number,
): Promise<SuccessResponse<Notification>> {
  const response = await API.delete<SuccessResponse<Notification>>(
    notificationEndpoints.delete(accountId, notificationId),
  );

  return response.data;
}
