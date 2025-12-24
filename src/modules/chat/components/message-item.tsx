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

const messageBubbleVariants = tv({
  base: 'px-md py-sm max-w-[80%]',
  variants: {
    type: {
      incoming: 'bg-surface self-start',
      outgoing: 'bg-accent self-end',
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

export function MessageItem({
  currentMessage: message,
  ...props
}: BubbleProps<IMessage>): React.JSX.Element {
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

  const isOutgoing = props.position === 'right';

  // TODO: Render other message types
  // if (message.content_attributes) {}
  // if (message.content_type === 'incoming_email') {}
  // if (isEmailInbox && !message.private) {}

  // Render regular message with bubble
  return (
    <View
      className={twMerge(
        messageBubbleVariants({
          type: isOutgoing ? 'outgoing' : 'incoming',
        }),
      )}
    >
      <Text
        variant="bodyS"
        className={isOutgoing ? 'text-foreground-inverted' : 'text-foreground'}
      >
        {message.text}
      </Text>
      <View className="gap-xs flex-row items-center justify-end">
        <Text variant="labelXS" color="muted">
          {dayjs(message.createdAt).format('HH:mm')}
        </Text>
        {isOutgoing && (
          <Icon
            name={message.pending ? 'clock' : 'tick'}
            size="base"
            className="text-muted-foreground"
          />
        )}
      </View>
    </View>
  );
}

function SystemMessage({
  currentMessage,
}: SystemMessageProps<IMessage>): React.JSX.Element {
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
