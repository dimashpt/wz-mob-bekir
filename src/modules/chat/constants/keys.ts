/**
 * This file contains the query keys for the chat module.
 * The query keys are used to identify and cache data for the chat module.
 * Query keys will use API endpoints as the base, and add additional parameters to the key,
 *  so usually the key will be a function that returns an array of strings.
 * Mutation keys will be an array of strings.
 */
import { ConversationAssignableAgentsParams } from '../services/agent/types';
import { ListConversationsParams } from '../services/conversation/types';

// Query keys factory for the conversation repository.
export const conversationKeys = {
  // Conversations
  list: (accountId: number, params?: ListConversationsParams) =>
    ['conversation-list', accountId, params].filter(Boolean),
  updateLastSeen: (accountId: number, conversationId: string) => [
    'conversation-update-last-seen',
    accountId,
    conversationId,
  ],
  participants: (accountId: number, conversationId: string) => [
    'conversation-participants',
    accountId,
    conversationId,
  ],
  updateStatus: ['conversation-update-status'],
  updateAssignee: ['conversation-update-assignee'],
  updatePriority: ['conversation-update-priority'],
  updateLabels: ['conversation-update-labels'],
  mute: ['conversation-mute'],
  unmute: ['conversation-unmute'],
  unread: ['conversation-unread'],
  updateBulk: ['conversation-update-bulk'],
  updateTypingStatus: ['conversation-update-typing-status'],
  // Messages
  messages: (accountId: number, conversationId: string, before?: number) => [
    'message-list',
    accountId,
    conversationId,
    before ?? 0,
    'infinite',
  ],
  sendMessage: ['message-send'],
  deleteMessage: ['conversation-delete-message'],
};

// Query keys factory for the agent repository.
export const agentKeys = {
  list: (accountId: number, params: ConversationAssignableAgentsParams) => [
    'agent-list',
    accountId,
    params,
  ],
};

// Query keys factory for the team repository.
export const teamKeys = {
  list: (accountId: number) => ['team-list', accountId],
};

// Query keys factory for the label repository.
export const labelKeys = {
  list: (accountId: number) => ['label-list', accountId],
};

// Query keys factory for the macro repository.
export const macroKeys = {
  list: (accountId: number) => ['macro-list', accountId],
};
