const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL;

export const CONVERSATIONS_ENDPOINTS = {
  LIST_CONVERSATIONS: (accountId: number) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/conversations`,
  UPDATE_LAST_SEEN: (accountId: number, conversationId: string) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/update_last_seen`,
  MESSAGES: (accountId: number, conversationId: string) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
  TEAMS: (accountId: number) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/teams`,
  ASSIGNABLE_AGENTS: (accountId: number) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/assignable_agents`,
  MACROS: (accountId: number) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/macros`,
  PARTICIPANTS: (accountId: number, conversationId: string) =>
    `${CHAT_BASE_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/participants`,
} as const;
