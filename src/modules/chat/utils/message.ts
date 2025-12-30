import { InfiniteData } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { IMessage } from 'react-native-gifted-chat';

import { ChatMessage } from '../components/message-item';
import { MESSAGE_TYPES } from '../constants/flags';
import {
  ConversationMessagesResponse,
  Message,
} from '../services/conversation-room/types';

type SectionGroupMessages = {
  data: Message[];
  date: string;
};

type DateSeparator = { date: string; type: 'date' };
export type MessageOrDate = Message | DateSeparator;

const groupBy = <T>(
  array: T[],
  keyGetter: (item: T) => string,
): Record<string, T[]> => {
  return array.reduce(
    (acc, item) => {
      const key = keyGetter(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
};

export function getGroupedMessages(
  messages: Message[],
): SectionGroupMessages[] {
  const conversationGroupedByDate = groupBy(
    Object.values(messages),
    (message: Message) =>
      dayjs(message.created_at * 1000).format('D MMMM YYYY'),
  );
  return Object.keys(conversationGroupedByDate).map((date) => {
    const groupedMessages = conversationGroupedByDate[date].map(
      (message: Message, index: number) => {
        let shouldRenderAvatar = false;
        if (index === conversationGroupedByDate[date].length - 1) {
          shouldRenderAvatar = true;
        } else {
          const nextMessage = conversationGroupedByDate[date][index + 1];
          const currentSender = message.sender ? message.sender.name : '';
          const nextSender = nextMessage.sender ? nextMessage.sender.name : '';
          shouldRenderAvatar =
            currentSender !== nextSender ||
            message.message_type !== nextMessage.message_type;
        }
        return { ...message, shouldRenderAvatar };
      },
    );

    return {
      date,
      data: groupedMessages,
    };
  });
}

export function groupMessagesByDate(messages: Message[]): MessageOrDate[] {
  const groupedMessages = getGroupedMessages(messages ?? []);
  const allMessages = groupedMessages.flatMap((section) => [
    { date: section.date },
    ...section.data,
  ]);
  const messagesWithGrouping = allMessages.map((message, index) => ({
    ...(message as MessageOrDate),
    groupWithNext: shouldGroupWithNext(index, allMessages as MessageOrDate[]),
    groupWithPrevious: shouldGroupWithNext(
      index - 1,
      allMessages as MessageOrDate[],
    ),
  }));

  return messagesWithGrouping;
}

/**
 * Determines if a message should be grouped with the next message and previous message
 * @param {Number} index - Index of the current message
 * @param {Array} searchList - Array of messages to check
 * @returns {Boolean} - Whether the message should be grouped with next
 */
export function shouldGroupWithNext(
  index: number,
  searchList: MessageOrDate[],
): boolean {
  if (index < 0) return false;

  if (index === searchList.length - 1) return false;

  const current = searchList[index];
  const next = searchList[index + 1];

  if ('date' in current) return false;
  if ('date' in next) return false;

  if (!current.id || !next.id) return false;

  if (next.status === 'failed') return false;

  const nextSenderId = next.sender?.id ?? next.sender?.id;
  const currentSenderId = current.sender?.id ?? current.sender?.id;
  const hasSameSender = nextSenderId === currentSenderId;

  const nextMessageType = next.message_type;
  const currentMessageType = current.message_type;

  const areBothTemplates =
    nextMessageType === MESSAGE_TYPES.TEMPLATE &&
    currentMessageType === MESSAGE_TYPES.TEMPLATE;

  if (!hasSameSender || areBothTemplates) return false;

  if (currentMessageType !== nextMessageType) return false;

  // Check if messages are in the same minute by rounding down to nearest minute
  return (
    Math.floor(next.created_at / 60) === Math.floor(current.created_at / 60)
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
