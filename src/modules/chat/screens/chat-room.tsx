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
import { groupMessagesByDate } from '../utils/message';

type Params = {
  conversation_id: string;
};

export default function ChatRoomScreen(): JSX.Element {
  const { conversation_id } = useLocalSearchParams<Params>();

  const flatListRef = useRef<FlatList>(null);
  const { bottom } = useSafeAreaInsets();
  const spacingMd = useCSSVariable('--spacing-md') as number;

  const _updateLastSeen = useUpdateLastSeenQuery(undefined, conversation_id);
  const { data: messages } = useListMessagesQuery(
    {
      select: (data) => ({
        ...data,
        payload: groupMessagesByDate(data.payload ?? []),
      }),
    },
    conversation_id,
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages?.payload?.length && messages.payload.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages?.payload]);

  return (
    <Container className="bg-background flex-1">
      <Header
        renderTitle={() => (
          <View className="gap-sm flex-row items-center">
            <Avatar
              name={messages?.meta?.contact?.name ?? ''}
              className="size-8"
              textClassName="text-lg"
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
          data={messages?.payload ?? []}
          contentContainerClassName="pt-lg px-lg gap-sm"
          keyExtractor={(item) =>
            'date' in item ? item.date : item.id.toString()
          }
          renderItem={({ item }) => <MessageItem message={item} />}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          ListFooterComponent={() => <View className="h-lg" />}
        />
        <ChatRoomInput flatListRef={flatListRef as React.RefObject<FlatList>} />
      </KeyboardAvoidingView>
    </Container>
  );
}
