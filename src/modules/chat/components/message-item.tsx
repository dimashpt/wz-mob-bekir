import { View } from 'react-native';

import dayjs from 'dayjs';
import {
  BubbleProps,
  DayProps,
  IMessage,
  SystemMessageProps,
} from 'react-native-gifted-chat';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Icon, Text } from '@/components';
import { MESSAGE_TYPES } from '../constants/flags';
import { Message } from '../services/conversation-room/types';

const messageBubbleVariants = tv({
  base: 'px-md py-sm max-w-[80%] bg-surface self-start',
  variants: {
    type: {
      incoming: 'bg-surface self-start',
      outgoing: 'bg-accent self-end',
      private: 'bg-accent-soft self-end',
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
      private: 'text-accent',
      template: 'text-foreground',
    },
  },
});

type ChatMessage = IMessage & Message;
type MessageType = 'incoming' | 'outgoing' | 'private' | 'template';

export function MessageItem({
  currentMessage: message,
}: BubbleProps<ChatMessage>): React.JSX.Element {
  // Render activity message
  if (message?.system) {
    return (
      <Text
        variant="bodyXS"
        color="muted"
        className="font-map-medium text-center font-medium"
      >
        {message.text} {dayjs(message.createdAt).format('HH:mm')}
      </Text>
    );
  }

  const isOutgoing = message.message_type === MESSAGE_TYPES.OUTGOING;
  const isPrivate = message.private;
  const isTemplate = message.message_type === MESSAGE_TYPES.TEMPLATE;

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
    <View
      className={twMerge(messageBubbleVariants({ type: getMessageType() }))}
    >
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
              message.status === 'read' ? 'text-info' : 'text-muted-foreground'
            }
          />
        )}
      </View>
    </View>
  );
}

function SystemMessage({
  currentMessage,
}: SystemMessageProps<ChatMessage>): React.JSX.Element {
  return (
    <Text
      variant="bodyXS"
      color="muted"
      className="font-map-medium my-xs text-center font-medium"
    >
      {currentMessage.text} {dayjs(currentMessage.createdAt).format('HH:mm')}
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
