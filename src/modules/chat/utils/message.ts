import { InfiniteData } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';

import { optimisticUpdateQuery, queryClient } from '@/lib/react-query';
import { ChatMessage } from '@/modules/@types/chat';
import { MESSAGE_TYPES } from '../constants/flags';
import { conversationKeys } from '../constants/keys';
import { getSortFilterOptions } from '../constants/options';
import {
  Conversation,
  ConversationDetailsResponse,
  ListConversationsResponse,
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
  conversationId: string,
  newMessage: Message,
): Promise<void> {
  const queryKey = conversationKeys.messages(conversationId);

  optimisticUpdateQuery<InfiniteData<ConversationDetailsResponse>>(
    queryKey,
    (old) => {
      if (!old) return old;

      const updatedPages = old.pages.map((page, index) => {
        if (index !== 0) {
          return page;
        }

        // Check for duplicates by echo_id or id before adding
        const isDuplicate = page.data.messages.some(
          (msg) =>
            (msg.echo_id && msg.echo_id === newMessage.echo_id) ||
            msg.id === newMessage.id,
        );

        if (isDuplicate) {
          return page;
        }

        return {
          ...page,
          data: {
            ...page.data,
            messages: [...page.data.messages, newMessage],
          },
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
  conversationId: string,
  echoId: string,
  updatedMessage: Message,
): Promise<void> {
  const queryKey = conversationKeys.messages(conversationId);

  optimisticUpdateQuery<InfiniteData<ConversationDetailsResponse>>(
    queryKey,
    (old) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            messages: page.data.messages.map((message) =>
              message.echo_id === echoId ? updatedMessage : message,
            ),
          },
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
  conversationId: string,
  messageId: string,
  updatedMessage: Message,
): Promise<void> {
  const queryKey = conversationKeys.messages(conversationId);

  optimisticUpdateQuery<InfiniteData<ConversationDetailsResponse>>(
    queryKey,
    (old) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            messages: page.data.messages.map((message) =>
              message.id === messageId ? updatedMessage : message,
            ),
          },
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
  conversationId: string,
  messageId: string,
): Promise<void> {
  const queryKey = conversationKeys.messages(conversationId);

  optimisticUpdateQuery<InfiniteData<ConversationDetailsResponse>>(
    queryKey,
    (old) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            messages: page.data.messages.map((message) =>
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
          },
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
    createdAt: new Date(message.created_at).getTime(),
    user: {
      _id:
        message.message_type === MESSAGE_TYPES.OUTGOING
          ? 'me'
          : message.message_type,
      name:
        message.message_type === MESSAGE_TYPES.TEMPLATE
          ? 'System Bot'
          : (message.message_type ?? ''),
    },
    system: message.message_type === MESSAGE_TYPES.ACTIVITY,
    pending: message.status === 'sending',
    sent: message.status === 'sent',
  };
}

/**
 * Maps infinite messages to GiftedChat messages
 * @param {InfiniteData<ConversationDetailsResponse>} data - The infinite data to map
 * @returns {InfiniteData<ConversationDetailsResponse> & { messages: Array<ChatMessage> }} - The mapped data
 */
export function mapInfiniteMessagesToGiftedChatMessages(
  data: InfiniteData<ConversationDetailsResponse>,
): InfiniteData<ConversationDetailsResponse> & {
  messages: Array<ChatMessage>;
} {
  // Merge all pages into a single array
  const mergedMessages = data.pages.flatMap(
    (page) => page?.data?.messages ?? [],
  );

  // Sort messages from oldest to newest
  const sortedMessages = mergedMessages.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Map messages to the expected format
  return {
    ...data,
    messages: sortedMessages.map((message) => ({
      ...mapMessageToGiftedChatMessage(message),
      ...message,
    })),
  };
}

/**
 * Updates the last activity of a conversation in the list conversations query
 * @param message - The message to update the last activity with
 */
export function updateConversationLastActivity(message: Message): void {
  const queryKey = conversationKeys.list({});
  const [, params] = queryKey;
  const filters = getSortFilterOptions();

  const queryData = queryClient.getQueriesData({ queryKey });

  queryData.forEach(([key]) => {
    optimisticUpdateQuery<ListConversationsResponse>(key, (old) => {
      if (!old) return old;

      const updatedPayload = old?.data?.map((conversation) =>
        conversation?.id === message?.conversation_id
          ? {
              ...conversation,
              last_activity_at: message.created_at,
              last_non_activity_message: message,
              messages: [message],
              timestamp: message.created_at,
            }
          : conversation,
      ) as Conversation[];

      let payload = updatedPayload;

      // Sort conversations by last_activity_at in descending order (newest first)
      if (!params?.sort_by || params?.sort_by === filters?.[0].value) {
        payload = updatedPayload?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      }

      return {
        ...old,
        data: { ...old.data, payload },
      };
    });
  });
}
