const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL;

const base = (accountId: number): string =>
  `${CHAT_BASE_URL}/api/v1/accounts/${accountId}`;

export const settingEndpoints = {
  notifications: (accountId: number) =>
    `${base(accountId)}/notification_settings`,
} as const;
