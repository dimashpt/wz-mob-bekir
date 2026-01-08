import { InfiniteData } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';

import { ChatMessage } from '../components/message-item';
import { MESSAGE_TYPES } from '../constants/flags';
import {
  ConversationMessagesResponse,
  Message,
} from '../services/conversation/types';

/**
 * Generates a random UUID for the echo ID
 * @returns {String} - The generated echo ID
 */
export function generateEchoId(): string {
  return 'xxxxxxxx4xxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;

    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Maps a message to a GiftedChat message
 * @param {Message} message - The message to map
 * @returns {IMessage} - The mapped message
 */
export function mapMessageToGiftedChatMessage(message: Message): IMessage {
  return {
    _id: message.id,
    text: message.content,
    createdAt: message.created_at * 1000,
    user: {
      _id:
        message.message_type === MESSAGE_TYPES.TEMPLATE
          ? 'system'
          : `${message.sender?.id ?? 0}-${message.message_type}`,
      name:
        message.message_type === MESSAGE_TYPES.TEMPLATE
          ? 'System Bot'
          : (message.sender?.name ?? ''),
    },
    system:
      message.message_type === MESSAGE_TYPES.ACTIVITY ||
      message.content_attributes.deleted,
    pending: message.status === 'sending',
    sent: message.status === 'sent',
  };
}

/**
 * Maps infinite messages to GiftedChat messages
 * @param {InfiniteData<ConversationMessagesResponse>} data - The infinite data to map
 * @returns {InfiniteData<ConversationMessagesResponse> & { messages: Array<ChatMessage> }} - The mapped data
 */
export function mapInfiniteMessagesToGiftedChatMessages(
  data: InfiniteData<ConversationMessagesResponse>,
): InfiniteData<ConversationMessagesResponse> & {
  messages: Array<ChatMessage>;
} {
  // Merge all pages into a single array
  const mergedMessages = data.pages.flatMap((page) => page?.payload ?? []);

  // Sort messages from oldest to newest
  const sortedMessages = mergedMessages.sort((a, b) => b.id - a.id);

  // Map messages to the expected format
  return {
    ...data,
    messages: sortedMessages.map((message) => ({
      ...mapMessageToGiftedChatMessage(message),
      ...message,
    })),
  };
}
