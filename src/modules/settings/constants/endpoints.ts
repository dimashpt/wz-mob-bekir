const BASE = '/tenant/v1/chat';

export const settingEndpoints = {
  notifications: (accountId: number) => `${BASE}/notification_settings`,
} as const;
