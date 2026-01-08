const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL;

const base = (accountId: number): string =>
  `${CHAT_BASE_URL}/api/v1/accounts/${accountId}`;

export const conversationEndpoints = {
  // Conversations
  list: (accountId: number) => `${base(accountId)}/conversations`,
  details: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}`,
  updateLastSeen: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}/update_last_seen`,
  participants: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}/participants`,
  updateStatus: (accountId: number, conversationId: number) =>
    `${base(accountId)}/conversations/${conversationId}/toggle_status`,
  updateAssignee: (accountId: number, conversationId: number) =>
    `${base(accountId)}/conversations/${conversationId}/assignments`,
  updatePriority: (accountId: number, conversationId: number) =>
    `${base(accountId)}/conversations/${conversationId}/toggle_priority`,
  updateLabels: (accountId: number, conversationId: number) =>
    `${base(accountId)}/conversations/${conversationId}/labels`,
  mute: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}/mute`,
  unmute: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}/unmute`,
  unread: (accountId: number, conversationId: number) =>
    `${base(accountId)}/conversations/${conversationId}/unread`,
  updateBulk: (accountId: number) => `${base(accountId)}/bulk_actions`,
  updateTypingStatus: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}/toggle_typing_status`,
  // Messages
  messages: (accountId: number, conversationId: string) =>
    `${base(accountId)}/conversations/${conversationId}/messages`,
  sendMessage: (accountId: number, conversationId: string) =>
    conversationEndpoints.messages(accountId, conversationId),
  deleteMessage: (
    accountId: number,
    conversationId: string,
    messageId: number,
  ) =>
    `${base(accountId)}/conversations/${conversationId}/messages/${messageId}`,
} as const;

export const agentEndpoints = {
  list: (accountId: number) => `${base(accountId)}/assignable_agents`,
} as const;

export const teamEndpoints = {
  list: (accountId: number) => `${base(accountId)}/teams`,
} as const;

export const labelEndpoints = {
  list: (accountId: number) => `${base(accountId)}/labels`,
} as const;

export const macroEndpoints = {
  list: (accountId: number) => `${base(accountId)}/macros`,
  execute: (accountId: number, macroId: string) =>
    `${base(accountId)}/macros/${macroId}/execute`,
} as const;

export const inboxEndpoints = {
  list: (accountId: number) => `${base(accountId)}/inboxes`,
} as const;
