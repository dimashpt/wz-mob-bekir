import React, { JSX } from 'react';
import { FlatList, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import {
  Avatar,
  Button,
  Clickable,
  Container,
  Header,
  Icon,
  InputField,
  Text,
} from '@/components';
import { MessageItem } from '../components/message-item';
import { useListMessagesQuery } from '../services/conversation-room/repository';
import {
  getGroupedMessages,
  MessageOrDate,
  shouldGroupWithNext,
} from '../utils/message';

type Params = {
  conversation_id: string;
};

export default function ChatRoomScreen(): JSX.Element {
  const { conversation_id } = useLocalSearchParams<Params>();
  // const _updateLastSeen = useUpdateLastSeenQuery(undefined, conversation_id);
  const { data: messages } = useListMessagesQuery(undefined, conversation_id);
  // const _participants = useListParticipantsQuery(undefined, conversation_id);
  // const _macros = useListMacrosQuery(undefined);
  // const _teams = useListTeamsQuery(undefined);
  // TODO: Implement get inbox_id from the conversation
  // const _assignableAgents = useListAssignableAgentsQuery(undefined, {
  //   inbox_ids: [],
  // });

  const groupedMessages = getGroupedMessages(messages?.payload ?? []);
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

  return (
    <Container className="bg-background flex-1">
      <Header
        renderTitle={() => (
          <View className="gap-sm flex-row items-center">
            <Avatar
              name={messages?.meta?.contact?.name ?? ''}
              className="size-8"
            />
            <Text variant="labelL">{messages?.meta?.contact?.name}</Text>
          </View>
        )}
      />
      <FlatList
        data={messagesWithGrouping ?? []}
        contentContainerClassName="p-lg gap-sm"
        keyExtractor={(item) =>
          'date' in item ? item.date : item.id.toString()
        }
        renderItem={({ item }) => <MessageItem message={item} />}
      />
      <View className="pb-safe pt-sm bg-surface px-lg gap-sm flex-row items-center">
        <Clickable onPress={() => {}} className="p-xs">
          <Icon name="plus" size="2xl" className="text-foreground" />
        </Clickable>
        <View className="flex-1">
          <InputField
            placeholder="Type your message..."
            className="bg-background"
            inputClassName="py-sm"
            multiline
          />
        </View>
        <Button onPress={() => {}} icon="send" size="small" />
      </View>
    </Container>
  );
}
