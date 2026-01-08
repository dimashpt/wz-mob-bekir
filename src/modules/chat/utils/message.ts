import { InfiniteData } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';

import { queryClient } from '@/lib/react-query';
import { ChatMessage } from '../components/message-item';
import { MESSAGE_TYPES } from '../constants/flags';
import { conversationKeys } from '../constants/keys';
import {
  ConversationMessagesResponse,
  Message,
} from '../services/conversation/types';

/**
 * Cancels queries and adds a new message to the first page of infinite query data.
 * Prevents duplicates by checking echo_id and message id.
 * @param accountId - The account ID
 * @param conversationId - The conversation ID
 * @param newMessage - The message to add
 */
export async function addMessageToQuery(
  accountId: number,
  conversationId: string,
  newMessage: Message,
): Promise<void> {
  const queryKey = conversationKeys.messages(accountId, conversationId);

  await queryClient.cancelQueries({ queryKey });

  queryClient.setQueryData(
    queryKey,
    (old: InfiniteData<ConversationMessagesResponse>) => {
      if (!old) {
        return old;
      }

      const updatedPages = old.pages.map((page, index) => {
        if (index !== 0) {
          return page;
        }

        // Check for duplicates by echo_id or id before adding
        const isDuplicate = page.payload.some(
          (msg) =>
            (msg.echo_id && msg.echo_id === newMessage.echo_id) ||
            msg.id === newMessage.id,
        );

        if (isDuplicate) {
          return page;
        }

        return {
          ...page,
          payload: [...page.payload, newMessage],
        };
      });

      return {
        ...old,
        pages: updatedPages,
      };
    },
  );
}

/**
 * Cancels queries and updates an existing message by echo_id.
 * Used when send message API returns success to replace optimistic message.
 * @param accountId - The account ID
 * @param conversationId - The conversation ID
 * @param echoId - The echo_id of the message to update
 * @param updatedMessage - The updated message from server
 */
export async function updateMessageByEchoIdInQuery(
  accountId: number,
  conversationId: string,
  echoId: string,
  updatedMessage: Message,
): Promise<void> {
  const queryKey = conversationKeys.messages(accountId, conversationId);

  await queryClient.cancelQueries({ queryKey });

  queryClient.setQueryData(
    queryKey,
    (old: InfiniteData<ConversationMessagesResponse>) => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          payload: page.payload.map((message) =>
            message.echo_id === echoId ? updatedMessage : message,
          ),
        })),
      };
    },
  );
}

/**
 * Cancels queries and updates an existing message by message id.
 * Used for websocket message.updated events.
 * @param accountId - The account ID
 * @param conversationId - The conversation ID
 * @param messageId - The id of the message to update
 * @param updatedMessage - The updated message from server
 */
export async function updateMessageByIdInQuery(
  accountId: number,
  conversationId: string,
  messageId: number,
  updatedMessage: Message,
): Promise<void> {
  const queryKey = conversationKeys.messages(accountId, conversationId);

  await queryClient.cancelQueries({ queryKey });

  queryClient.setQueryData(
    queryKey,
    (old: InfiniteData<ConversationMessagesResponse>) => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          payload: page.payload.map((message) =>
            message.id === messageId ? updatedMessage : message,
          ),
        })),
      };
    },
  );
}

/**
 * Cancels queries and marks a message as deleted.
 * Updates message content and sets deleted flag.
 * @param accountId - The account ID
 * @param conversationId - The conversation ID
 * @param messageId - The id of the message to mark as deleted
 */
export async function markMessageAsDeletedInQuery(
  accountId: number,
  conversationId: string,
  messageId: number,
): Promise<void> {
  const queryKey = conversationKeys.messages(accountId, conversationId);

  await queryClient.cancelQueries({ queryKey });

  queryClient.setQueryData(
    queryKey,
    (old: InfiniteData<ConversationMessagesResponse>) => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          payload: page.payload.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: 'This message was deleted',
                  content_attributes: {
                    ...message.content_attributes,
                    deleted: true,
                  },
                }
              : message,
          ),
        })),
      };
    },
  );
}

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
