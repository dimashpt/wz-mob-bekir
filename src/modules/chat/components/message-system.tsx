import dayjs from 'dayjs';
import { SystemMessageProps } from 'react-native-gifted-chat';

import { Text } from '@/components';
import { ChatMessage } from '@/modules/@types/chat';

export function MessageSystem({
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
