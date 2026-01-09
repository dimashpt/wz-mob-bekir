import { ListNotificationParams } from '../services/types';

export const notificationKeys = {
  list: (accountId: number, requestParams: ListNotificationParams) => [
    'notification-list',
    accountId,
    requestParams,
  ],
  readAll: (accountId: number) => ['notification-read-all', accountId],
  unread: (accountId: number, notificationId: number) => [
    'notification-unread',
    accountId,
    notificationId,
  ],
  delete: (accountId: number, notificationId: number) => [
    'notification-delete',
    accountId,
    notificationId,
  ],
};
