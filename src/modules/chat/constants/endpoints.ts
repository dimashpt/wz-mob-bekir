const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL;

export const CONVERSATIONS_ENDPOINTS = {
  LIST_CONVERSATIONS: (accountId: number) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/conversations`,
} as const;
