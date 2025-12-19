import React from 'react';
import { View } from 'react-native';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';

import { Avatar, Icon, Text } from '@/components';
import { AnimatedComponent } from '@/components/animated-component';
import { Clickable } from '@/components/clickable';
import { Container } from '@/components/container';
import { formatDisplayDate } from '@/utils/date';
import { Conversation } from '../services/conversation/types';

export default function ChatListItem({
  item,
  index,
}: {
  item: Conversation;
  index: number;
}): React.JSX.Element {
  const router = useRouter();

  const priorityClassName = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-danger',
    urgent: 'text-danger',
    none: 'text-muted-foreground',
  };

  return (
    <AnimatedComponent index={index % 10}>
      <Clickable
        onPress={() => router.push(`/chat-room?conversation_id=${item.id}`)}
      >
        <Container.Card className="gap-sm flex-row items-center">
          {/* Create avatar from sender initials */}
          <Avatar name={item.meta.sender.name} textClassName="text-lg" />
          <View className="flex-1 justify-between">
            <View className="gap-xs flex-1 flex-row items-start justify-between">
              <View className="gap-xs flex-row items-center">
                <Text variant="labelM" className="pr-xxs capitalize">
                  {item.meta.sender.name}
                </Text>
                <Text variant="bodyS" color="muted">
                  #{item.id}
                </Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <Text variant="bodyXS" color="muted">
                  {formatDisplayDate(dayjs(item.timestamp * 1000), false)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="gap-xs flex-row items-center">
                {item.last_non_activity_message.sender.type === 'user' && (
                  <Icon
                    name="tick"
                    size="sm"
                    className="text-muted-foreground"
                  />
                )}
                <Text variant="bodyXS" color="muted">
                  {item.last_non_activity_message.content}
                </Text>
              </View>
              <View className="gap-sm flex-row items-center">
                {item.priority && (
                  <Icon
                    name="signal"
                    className={priorityClassName[item.priority]}
                  />
                )}
                {item.meta.assignee && (
                  <Avatar name={item.meta.assignee.name} className="size-5" />
                )}
              </View>
            </View>
          </View>
        </Container.Card>
      </Clickable>
    </AnimatedComponent>
  );
}
