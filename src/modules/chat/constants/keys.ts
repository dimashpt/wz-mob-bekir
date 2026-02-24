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
  list: (params?: ListConversationsParams) =>
    ['conversation-list', params].filter(Boolean) as [
      string,
      ListConversationsParams?,
    ],
  details: (conversationId: string) => ['conversation-details', conversationId],
  updateLastSeen: (conversationId: string) => [
    'conversation-update-last-seen',
    conversationId,
  ],
  participants: (conversationId: string) => [
    'conversation-participants',
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
  messages: (conversationId: string) => [
    'message-list',
    conversationId,
    'infinite',
  ],
  sendMessage: ['message-send'],
  deleteMessage: ['conversation-delete-message'],
};

// Query keys factory for the agent repository.
export const agentKeys = {
  list: (params: ConversationAssignableAgentsParams) => ['agent-list', params],
};

// Query keys factory for the team repository.
export const teamKeys = {
  list: ['team-list'],
};

// Query keys factory for the label repository.
export const labelKeys = {
  list: ['label-list'],
};

// Query keys factory for the macro repository.
export const macroKeys = {
  list: ['macro-list'],
};

// Query keys factory for the inbox repository.
export const inboxKeys = {
  list: ['inbox-list'],
};

// Query keys factory for the attribute repository.
export const attributeKeys = {
  list: ['attribute-list'],
};
