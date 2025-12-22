import React, { JSX, useEffect, useRef } from 'react';
import { FlatList, Platform, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

import { Avatar, Container, Header, Text } from '@/components';
import { ChatRoomInput } from '../components/chat-room-input';
import { MessageItem } from '../components/message-item';
import {
  useListMessagesQuery,
  useUpdateLastSeenQuery,
} from '../services/conversation-room/repository';
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

  const flatListRef = useRef<FlatList>(null);
  const { bottom } = useSafeAreaInsets();
  const spacingMd = useCSSVariable('--spacing-md') as number;

  const _updateLastSeen = useUpdateLastSeenQuery(undefined, conversation_id);
  const { data: messages } = useListMessagesQuery(undefined, conversation_id);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesWithGrouping.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messagesWithGrouping.length]);

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={-bottom + spacingMd}
      >
        <FlatList
          ref={flatListRef}
          data={messagesWithGrouping ?? []}
          contentContainerClassName="p-lg gap-sm"
          keyExtractor={(item) =>
            'date' in item ? item.date : item.id.toString()
          }
          renderItem={({ item }) => <MessageItem message={item} />}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
        <ChatRoomInput flatListRef={flatListRef as React.RefObject<FlatList>} />
      </KeyboardAvoidingView>
    </Container>
  );
}
