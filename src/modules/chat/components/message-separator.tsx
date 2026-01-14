import { View } from 'react-native';

import dayjs from 'dayjs';
import { DayProps } from 'react-native-gifted-chat';

import { Text } from '@/components';

export function MessageSeparator({ createdAt }: DayProps): React.JSX.Element {
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
