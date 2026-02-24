const base = (accountId: number): string => '/tenant/v1/chat';

export const notificationEndpoints = {
  list: (accountId: number) => `${base(accountId)}/notifications`,
  readAll: (accountId: number) => `${base(accountId)}/notifications/read_all`,
  unread: (accountId: number, notificationId: number) =>
    `${base(accountId)}/notifications/${notificationId}/unread`,
  delete: (accountId: number, notificationId: number) =>
    `${base(accountId)}/notifications/${notificationId}`,
} as const;
