import React, { JSX, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Container, Header, PagerView, Text } from '@/components';
import { useAuthStore } from '@/store/auth-store';
import { ChatRoomAttributes } from '../components/chat-room-attributes';
import { ChatRoomInput } from '../components/chat-room-input';
import { MessageItem } from '../components/message-item';
import { MESSAGE_TYPES } from '../constants/flags';
import {
  useListMessagesInfiniteQuery,
  useUpdateLastSeenQuery,
} from '../services/conversation-room/repository';
import { mapInfiniteMessagesToGiftedChatMessages } from '../utils/message';

type Params = {
  conversation_id: string;
};

export default function ChatRoomScreen(): JSX.Element {
  const { conversation_id } = useLocalSearchParams<Params>();

  const { bottom } = useSafeAreaInsets();
  const pagerViewRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { chatUser } = useAuthStore();
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
    { select: mapInfiniteMessagesToGiftedChatMessages },
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
        key="1"
        ref={pagerViewRef}
        className="flex-1"
        initialPage={activeTab}
        onPageSelected={(event) => setActiveTab(event.nativeEvent.position)}
      >
        <GiftedChat
          messages={messages?.messages ?? []}
          user={{
            // Add outgoing message type to the user id, due to the given sender.id !== account_id
            _id: `${chatUser?.account_id ?? 0}-${MESSAGE_TYPES.OUTGOING}`,
            name: chatUser?.name ?? '',
          }}
          renderBubble={MessageItem}
          listProps={{
            ListHeaderComponent: () => (
              <View className="h-lg">
                {isFetchingNextPage ? <ActivityIndicator /> : null}
              </View>
            ),
            onEndReachedThreshold: 0.5,
            onEndReached: () => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            },
          }}
          renderSystemMessage={MessageItem.SystemMessage}
          renderDay={MessageItem.DaySeparator}
          renderInputToolbar={ChatRoomInput}
          keyboardAvoidingViewProps={{
            keyboardVerticalOffset: bottom + (Platform.OS === 'ios' ? 50 : 64),
          }}
        />
        <ChatRoomAttributes key="2" meta={meta} conversation={conversation} />
      </PagerView>
    </Container>
  );
}
