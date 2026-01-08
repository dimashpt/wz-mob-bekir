import React, { JSX, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { InfiniteData, useMutation } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Container, Header, Icon, PagerView, Text } from '@/components';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth-store';
import { ChatRoomAttributes } from '../components/chat-room-attributes';
import { ChatRoomInput } from '../components/chat-room-input';
import { MessageItem } from '../components/message-item';
import { MESSAGE_TYPES } from '../constants/flags';
import { conversationKeys } from '../constants/keys';
import { deleteMessage } from '../services/conversation';
import {
  useConversationDetailsQuery,
  useListMessagesInfiniteQuery,
  useUpdateLastSeenQuery,
} from '../services/conversation/repository';
import { ConversationMessagesResponse } from '../services/conversation/types';
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

  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useListMessagesInfiniteQuery(
    { select: mapInfiniteMessagesToGiftedChatMessages },
    conversation_id,
  );

  // Update the last seen timestamp for the conversation
  useUpdateLastSeenQuery(undefined, conversation_id);

  const { data: conversation } = useConversationDetailsQuery(
    {},
    conversation_id,
  );

  const queryKey = conversationKeys.messages(
    chatUser?.account_id ?? 0,
    conversation_id,
  );

  const deleteMessageMutation = useMutation({
    mutationKey: ['delete-message'],
    mutationFn: (messageId: number) =>
      deleteMessage(chatUser?.account_id ?? 0, conversation_id, messageId),
    onMutate: async (messageId, context) => {
      await context.client.cancelQueries({ queryKey });

      const previousMessages =
        context.client.getQueryData<InfiniteData<ConversationMessagesResponse>>(
          queryKey,
        );

      context.client.setQueryData(
        queryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              payload: page.payload.map((_message) =>
                _message.id === messageId
                  ? {
                      ..._message,
                      content: 'This message was deleted',
                      content_attributes: {
                        ..._message.content_attributes,
                        deleted: true,
                      },
                    }
                  : _message,
              ),
            })),
          };
        },
      );

      return { previousMessages };
    },
    onSuccess: (data, messageId, __, context) => {
      context.client.setQueryData(
        queryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              payload: page.payload.map((_message) =>
                _message.id === messageId ? data : _message,
              ),
            })),
          };
        },
      );
    },
  });

  const meta = messages?.pages?.[0]?.meta;

  useEffect(() => {
    // Invalidate the list conversations query to update the unread count
    queryClient.invalidateQueries({
      queryKey: conversationKeys.list(chatUser?.account_id ?? 0),
    });
  }, [conversation]);

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
            <Text variant="labelL" loading={isLoading}>
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
          renderBubble={(props) => (
            <MessageItem {...props} onDelete={deleteMessageMutation.mutate} />
          )}
          listProps={{
            contentContainerClassName: 'pb-md',
            ListFooterComponent: () =>
              isFetchingNextPage ? (
                <View className="py-xl">
                  <ActivityIndicator />
                </View>
              ) : null,
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
          renderAvatar={(props) => (
            <Avatar
              name={props.currentMessage.sender?.name ?? ''}
              className="bg-surface size-9"
              textClassName="text-lg"
              children={
                props.currentMessage.sender?.name ? undefined : (
                  <Icon
                    name="robot"
                    size="base"
                    className="text-muted-foreground"
                  />
                )
              }
            />
          )}
          keyboardAvoidingViewProps={{
            keyboardVerticalOffset: bottom + (Platform.OS === 'ios' ? 50 : 64),
          }}
        />
        <ChatRoomAttributes key="2" meta={meta} conversation={conversation} />
      </PagerView>
    </Container>
  );
}
