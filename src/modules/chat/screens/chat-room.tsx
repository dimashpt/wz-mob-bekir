import React, { JSX, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

import { Avatar, Container, Header, PagerView, Text } from '@/components';
import { ChatRoomAttributes } from '../components/chat-room-attributes';
import { ChatRoomInput } from '../components/chat-room-input';
import { MessageItem } from '../components/message-item';
import {
  useListMessagesInfiniteQuery,
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
  const pagerViewRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { data: conversation } = useUpdateLastSeenQuery(
    undefined,
    conversation_id,
  );

  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListMessagesInfiniteQuery(
    {
      select: (data) => ({
        ...data,
        payload: groupMessagesByDate(
          data.pages.flatMap((page) => page?.payload ?? []),
        ),
      }),
    },
    conversation_id,
  );

  const meta = messages?.pages?.[0]?.meta;

  return (
    <Container className="bg-background flex-1">
      <Header
        onPressBack={
          activeTab === 0 ? undefined : () => pagerViewRef.current?.setPage(0)
        }
        renderTitle={() => (
          <View className="gap-sm flex-row items-center">
            <Avatar
              name={messages?.pages?.[0]?.meta?.contact?.name ?? ''}
              className="size-8"
              textClassName="text-lg"
            />
            <Text variant="labelL">
              {messages?.pages?.[0]?.meta?.contact?.name}
            </Text>
          </View>
        )}
      />
      <PagerView
        ref={pagerViewRef}
        className="flex-1"
        initialPage={activeTab}
        onPageSelected={(event) => setActiveTab(event.nativeEvent.position)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
          keyboardVerticalOffset={-bottom + spacingMd}
          key="1"
        >
          <FlatList
            ref={flatListRef}
            data={messages?.payload ?? []}
            contentContainerClassName="pt-lg px-lg gap-sm flex-col-reverse"
            keyExtractor={(item) =>
              'date' in item ? item.date : item.id.toString()
            }
            renderItem={({ item }) => <MessageItem message={item} />}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            ListFooterComponent={() => <View className="h-lg" />}
            inverted
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            ListHeaderComponent={() => (
              <View className="h-lg">
                {isFetchingNextPage ? <ActivityIndicator /> : null}
              </View>
            )}
          />
          <ChatRoomInput
            flatListRef={flatListRef as React.RefObject<FlatList>}
          />
        </KeyboardAvoidingView>
        <ChatRoomAttributes key="2" meta={meta} conversation={conversation} />
      </PagerView>
    </Container>
  );
}
