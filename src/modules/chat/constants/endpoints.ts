const BASE = '/tenant/v1/chat';

export const conversationEndpoints = {
  // Chat
  list: () => BASE,
  details: (conversationId: string) => `${BASE}/${conversationId}`,
  updateStatus: (conversationId: string) =>
    `${BASE}/${conversationId}/toggle_status`,
  updateAssignee: (conversationId: string) =>
    `${BASE}/${conversationId}/assign`,
  updatePriority: (conversationId: string) =>
    `${BASE}/${conversationId}/toggle_priority`,
  updateLabels: (conversationId: string) => `${BASE}/${conversationId}/labels`,
} as const;

export const agentEndpoints = {
  list: `${BASE}/assignable_agents`,
} as const;

export const teamEndpoints = {
  list: `${BASE}/teams`,
} as const;

export const labelEndpoints = {
  list: `${BASE}/labels`,
} as const;

export const macroEndpoints = {
  list: `${BASE}/macros`,
  execute: (macroId: string) => `${BASE}/macros/${macroId}/execute`,
} as const;

export const inboxEndpoints = {
  list: `${BASE}/inboxes`,
} as const;

export const attributeEndpoints = {
  list: `${BASE}/custom_attribute_definitions`,
} as const;
