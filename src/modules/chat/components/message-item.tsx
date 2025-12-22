import { View } from 'react-native';

import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Icon, Text } from '@/components';
import { MESSAGE_TYPES } from '../constants/flags';
import { MessageOrDate } from '../utils/message';

type MessageItemProps = {
  message: MessageOrDate & {
    groupWithNext?: boolean;
    groupWithPrevious?: boolean;
  };
  className?: string;
};

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
  message,
  className,
}: MessageItemProps): React.JSX.Element {
  // Render date separator
  if ('date' in message) {
    return (
      <View className="py-sm flex-row items-center justify-center">
        <View className="bg-muted px-sm py-xs rounded-full">
          <Text variant="labelXS" color="muted">
            {message.date}
          </Text>
        </View>
      </View>
    );
  }

  // Render activity message
  if (message.message_type === MESSAGE_TYPES.ACTIVITY) {
    return (
      <Text
        variant="bodyXS"
        color="muted"
        className="font-map-medium text-center font-medium"
      >
        {message.content} {dayjs(message.created_at * 1000).format('HH:mm')}
      </Text>
    );
  }

  const isOutgoing = message.message_type === MESSAGE_TYPES.OUTGOING;

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
          groupWithPrevious: message.groupWithPrevious ?? false,
          groupWithNext: message.groupWithNext ?? false,
        }),
        className,
      )}
    >
      <Text
        variant="bodyS"
        className={isOutgoing ? 'text-foreground-inverted' : 'text-foreground'}
      >
        {message.content}
      </Text>
      <View className="gap-xs flex-row items-center justify-end">
        <Text variant="labelXS" color="muted">
          {dayjs(message.created_at * 1000).format('HH:mm')}
        </Text>
        <Icon
          name={message.status === 'sending' ? 'clock' : 'tick'}
          size="base"
          className="text-muted-foreground"
        />
      </View>
    </View>
  );
}
