const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL;

const base = (accountId: number): string =>
  `${CHAT_BASE_URL}/api/v1/accounts/${accountId}`;

export const notificationEndpoints = {
  list: (accountId: number) => `${base(accountId)}/notifications`,
  readAll: (accountId: number) => `${base(accountId)}/notifications/read_all`,
  unread: (accountId: number, notificationId: number) =>
    `${base(accountId)}/notifications/${notificationId}/unread`,
  delete: (accountId: number, notificationId: number) =>
    `${base(accountId)}/notifications/${notificationId}`,
} as const;
