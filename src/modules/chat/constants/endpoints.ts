const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL;

const baseUrl = (accountId: number): string =>
  `${CHAT_BASE_URL}/api/v1/accounts/${accountId}`;

export const CONVERSATIONS_ENDPOINTS = {
  LIST_CONVERSATIONS: (accountId: number) =>
    `${baseUrl(accountId)}/conversations`,
  UPDATE_LAST_SEEN: (accountId: number, conversationId: string) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/update_last_seen`,
  MESSAGES: (accountId: number, conversationId: string) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/messages`,
  TEAMS: (accountId: number) => `${baseUrl(accountId)}/teams`,
  ASSIGNABLE_AGENTS: (accountId: number) =>
    `${baseUrl(accountId)}/assignable_agents`,
  MACROS: (accountId: number) => `${baseUrl(accountId)}/macros`,
  PARTICIPANTS: (accountId: number, conversationId: string) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/participants`,
  UPDATE_TYPING_STATUS: (accountId: number, conversationId: string) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/toggle_typing_status`,
  SEND_MESSAGE: (accountId: number, conversationId: string) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/messages`,
  UPDATE_STATUS: (accountId: number, conversationId: number) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/toggle_status`,
  UPDATE_ASSIGNEE: (accountId: number, conversationId: number) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/assignments`,
  UPDATE_PRIORITY: (accountId: number, conversationId: number) =>
    `${baseUrl(accountId)}/conversations/${conversationId}/toggle_priority`,
} as const;
