const BASE = '/tenant/v1/chat';

export const conversationEndpoints = {
  // Chat
  list: () => BASE,
  details: (conversationId: string) => `${BASE}/${conversationId}`,
  updateLastSeen: (conversationId: string) =>
    `${BASE}/${conversationId}/update_last_seen`,
  participants: (conversationId: string) =>
    `${BASE}/${conversationId}/participants`,
  updateStatus: (conversationId: string) =>
    `${BASE}/${conversationId}/toggle_status`,
  updateAssignee: (conversationId: string) =>
    `${BASE}/${conversationId}/assignments`,
  updatePriority: (conversationId: string) =>
    `${BASE}/${conversationId}/toggle_priority`,
  updateLabels: (conversationId: string) => `${BASE}/${conversationId}/labels`,
  mute: (conversationId: string) => `${BASE}/${conversationId}/mute`,
  unmute: (conversationId: string) => `${BASE}/${conversationId}/unmute`,
  unread: (conversationId: string) => `${BASE}/${conversationId}/unread`,
  updateBulk: () => `${BASE}/bulk_actions`,
  updateTypingStatus: (conversationId: string) =>
    `${BASE}/${conversationId}/toggle_typing_status`,
  // Messages
  messages: (conversationId: string) => `${BASE}/${conversationId}/messages`,
  sendMessage: (conversationId: string) =>
    conversationEndpoints.messages(conversationId),
  deleteMessage: (conversationId: string, messageId: number) =>
    `${BASE}/${conversationId}/messages/${messageId}`,
} as const;

export const agentEndpoints = {
  list: () => `${BASE}/assignable_agents`,
} as const;

export const teamEndpoints = {
  list: () => `${BASE}/teams`,
} as const;

export const labelEndpoints = {
  list: () => `${BASE}/labels`,
} as const;

export const macroEndpoints = {
  list: () => `${BASE}/macros`,
  execute: (macroId: string) => `${BASE}/macros/${macroId}/execute`,
} as const;

export const inboxEndpoints = {
  list: () => `${BASE}/inboxes`,
} as const;

export const attributeEndpoints = {
  list: () => `${BASE}/custom_attribute_definitions`,
} as const;
