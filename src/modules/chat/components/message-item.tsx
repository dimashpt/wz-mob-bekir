import { useMemo } from 'react';
import { View } from 'react-native';

import { InfiniteData } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  BubbleProps,
  DayProps,
  IMessage,
  SystemMessageProps,
} from 'react-native-gifted-chat';
import { runOnJS } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable, Icon, Text } from '@/components';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth-store';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import { MESSAGE_TYPES } from '../constants/flags';
import {
  ConversationMessagesResponse,
  Message,
} from '../services/conversation-room/types';
import { mapInfiniteMessagesToGiftedChatMessages } from '../utils/message';

interface MessageItemProps extends BubbleProps<ChatMessage> {
  onDelete: (messageId: number) => void;
}
const messageBubbleVariants = tv({
  base: 'p-sm bg-surface self-start',
  variants: {
    type: {
      incoming: 'bg-surface self-start',
      outgoing: 'bg-accent self-end',
      private: 'bg-warning-soft self-end border border-warning',
      template: 'bg-info-soft self-start',
    },
    groupWithPrevious: {
      true: 'rounded-tl-sm rounded-tr-sm',
      false: 'rounded-tl-lg rounded-tr-lg',
    },
    groupWithNext: {
      true: 'rounded-bl-sm rounded-br-sm',
      false: 'rounded-bl-lg rounded-br-lg',
    },
  },
  defaultVariants: {
    type: 'incoming',
    groupWithPrevious: false,
    groupWithNext: false,
  },
});

const messageBubbleTextVariants = tv({
  base: 'text-foreground',
  variants: {
    type: {
      incoming: 'text-foreground',
      outgoing: 'text-foreground-inverted',
      private: 'text-yellow-600',
      template: 'text-foreground',
    },
  },
});

export type ChatMessage = IMessage & Message;
type MessageType = 'incoming' | 'outgoing' | 'private' | 'template';

export function MessageItem({
  currentMessage: message,
  onDelete,
}: MessageItemProps): React.JSX.Element {
  const { chatUser } = useAuthStore();
  const isOutgoing = message.message_type === MESSAGE_TYPES.OUTGOING;
  const isPrivate = message.private;
  const isTemplate = message.message_type === MESSAGE_TYPES.TEMPLATE;
  const isReplyMessage = message.content_attributes.in_reply_to;

  const queryKey = [
    CONVERSATIONS_ENDPOINTS.MESSAGES(
      chatUser?.account_id ?? 0,
      (message.conversation_id ?? '').toString(),
    ),
    'infinite',
  ];
  const messages =
    queryClient.getQueryData<InfiniteData<ConversationMessagesResponse>>(
      queryKey,
    );
  const replyMessage = useMemo(() => {
    const replyMessageId = message.content_attributes.in_reply_to;
    const mappedMessages = mapInfiniteMessagesToGiftedChatMessages(
      messages ?? { pages: [], pageParams: [] },
    );
    const repliedMessage = mappedMessages.messages.find(
      (m) => m.id === replyMessageId,
    );

    return repliedMessage?.text ?? '~';
  }, [message.content_attributes.in_reply_to]);
  const longPressGesture = Gesture.LongPress()
    .enabled(Boolean(onDelete))
    .minDuration(750)
    .maxDistance(20)
    .onStart(() => onDelete && runOnJS(onDelete)(message.id));

  function getMessageType(): MessageType {
    if (isPrivate) return 'private';

    if (isTemplate) return 'template';

    if (isOutgoing) return 'outgoing';

    return 'incoming';
  }

  // TODO: Render other message types
  // if (message.content_attributes) {}
  // if (message.content_type === 'incoming_email') {}
  // if (isEmailInbox && !message.private) {}

  // Render regular message with bubble
  return (
    <GestureDetector gesture={longPressGesture}>
      <View
        className={twMerge(messageBubbleVariants({ type: getMessageType() }))}
      >
        {isReplyMessage ? (
          <Clickable
            onPress={() => {}}
            className="gap-sm mb-xs p-xs flex-row items-center rounded-sm bg-white/20 dark:bg-black/20"
          >
            <Icon
              name="forward"
              size="sm"
              className="text-white/70 dark:text-black/70"
              transform="scale(-1,1)"
            />
            <View className="shrink">
              <Text
                variant="bodyXS"
                numberOfLines={3}
                className="text-white/70 dark:text-black/70"
              >
                {replyMessage}
              </Text>
            </View>
          </Clickable>
        ) : null}
        <Text
          variant="bodyS"
          className={messageBubbleTextVariants({ type: getMessageType() })}
        >
          {message.text}
        </Text>
        <View className="gap-xs flex-row items-center justify-end">
          {isPrivate && (
            <Icon name="lock" size="sm" className="text-muted-foreground" />
          )}
          {isTemplate && (
            <Icon name="robot" size="sm" className="text-muted-foreground" />
          )}
          <Text variant="labelXS" color="muted">
            {dayjs(message.createdAt).format('HH:mm')}
          </Text>
          {isOutgoing && (
            <Icon
              name={message.pending ? 'clock' : 'tick'}
              size="base"
              className={
                message.status === 'read'
                  ? 'text-info'
                  : 'text-muted-foreground'
              }
            />
          )}
        </View>
      </View>
    </GestureDetector>
  );
}

function SystemMessage({
  currentMessage,
}: SystemMessageProps<ChatMessage>): React.JSX.Element {
  const isDeleted = Boolean(currentMessage.content_attributes.deleted);

  return (
    <Text
      variant="bodyXS"
      color="muted"
      className="font-map-medium my-xs text-center font-medium"
    >
      {currentMessage.text}{' '}
      {isDeleted ? null : dayjs(currentMessage.createdAt).format('HH:mm')}
    </Text>
  );
}

function DaySeparator({ createdAt }: DayProps): React.JSX.Element {
  return (
    <View className="py-sm flex-row items-center justify-center">
      <View className="bg-muted px-sm py-xs rounded-full">
        <Text variant="labelXS" color="muted">
          {dayjs(createdAt).format('D MMMM')}
        </Text>
      </View>
    </View>
  );
}

MessageItem.displayName = 'MessageItem';

MessageItem.SystemMessage = SystemMessage;
MessageItem.DaySeparator = DaySeparator;
