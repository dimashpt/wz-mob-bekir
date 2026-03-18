import React, { JSX, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  Container,
  Header,
  Icon,
  ImagePreviewModal,
  PagerView,
  Text,
} from '@/components';
import { ChatMessage } from '@/modules/@types/chat';
import { useAuthStore } from '@/store/auth-store';
import { ChatRoomAttributes } from '../components/chat-room-attributes';
import { ChatRoomInput } from '../components/chat-room-input';
import { MessageItem } from '../components/message-item';
import { useConversationDetailsQuery } from '../services/conversation/repository';
import { mapInfiniteMessagesToGiftedChatMessages } from '../utils/message';

type Params = {
  conversation_id: string;
};

export default function ChatRoomScreen(): JSX.Element {
  const pagerViewRef = useRef<PagerView>(null);
  const imagePreviewRef = useRef<ImagePreviewModal>(null);

  const { conversation_id } = useLocalSearchParams<Params>();
  const { user } = useAuthStore();
  const { bottom } = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState(0);
  const [replyMessage, setReplyMessage] = useState<ChatMessage>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useConversationDetailsQuery(
      { select: mapInfiniteMessagesToGiftedChatMessages },
      conversation_id,
    );

  const conversation = data?.pages?.[0].data.conversation;

  return (
    <Container className="bg-background flex-1">
      <Header
        onPressBack={
          activeTab === 0 ? undefined : () => pagerViewRef.current?.setPage(0)
        }
        suffixIcon={
          activeTab === 0 && (
            <Icon name="info" size="lg" className="text-foreground" />
          )
        }
        onPressSuffix={() => pagerViewRef.current?.setPage(1)}
        renderTitle={() => (
          <View className="gap-sm flex-1 flex-row items-center">
            <Avatar
              name={data?.pages?.[0]?.data.contact.name ?? ''}
              className="size-8"
              textClassName="text-lg"
            />
            <Text variant="labelL" loading={isLoading}>
              {data?.pages?.[0]?.data.contact.name}
            </Text>
          </View>
        )}
      />
      <PagerView
        scrollEnabled
        ref={pagerViewRef}
        className="flex-1"
        initialPage={activeTab}
        onPageSelected={(event) => setActiveTab(event.nativeEvent.position)}
      >
        <GiftedChat
          messages={data?.messages ?? []}
          user={{
            // Add outgoing message type to the user id, due to the given sender.id !== id
            _id: 'me',
            name: user?.name ?? '',
          }}
          renderBubble={(props) => (
            <MessageItem
              {...props}
              onDelete={() => {}}
              onReply={setReplyMessage}
              onPreviewAttachment={(attachment) =>
                imagePreviewRef.current?.open(
                  attachment.data_url ?? attachment.thumb_url,
                )
              }
            />
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
          renderDay={(props) => <MessageItem.DaySeparator {...props} />}
          renderInputToolbar={(props) => (
            <ChatRoomInput
              {...props}
              replyTo={replyMessage}
              removeReply={() => setReplyMessage(undefined)}
            />
          )}
          renderAvatar={(props) => (
            <Avatar
              name={props.currentMessage.user.name ?? ''}
              className="bg-surface size-9"
              textClassName="text-lg"
              children={
                <Icon
                  name="user"
                  size="base"
                  className="text-muted-foreground"
                />
              }
            />
          )}
          isAvatarVisibleForEveryMessage={false}
          keyboardAvoidingViewProps={{
            keyboardVerticalOffset: bottom + (Platform.OS === 'ios' ? 50 : 64),
          }}
        />
        <ChatRoomAttributes key="2" conversation={conversation} />
      </PagerView>
      <ImagePreviewModal ref={imagePreviewRef} />
    </Container>
  );
}
