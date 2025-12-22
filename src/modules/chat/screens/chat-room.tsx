import React, { JSX, useRef } from 'react';
import { ActivityIndicator, FlatList, Platform, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

import {
  Avatar,
  Button,
  Container,
  Divider,
  Header,
  MenuItem,
  Text,
} from '@/components';
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

  const _updateLastSeen = useUpdateLastSeenQuery(undefined, conversation_id);
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

  return (
    <Container className="bg-background flex-1">
      <Header
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
      <PagerView style={{ flex: 1 }} initialPage={0}>
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
        <View key="2" className="p-lg gap-md flex-1">
          <View className="bg-surface px-lg py-md gap-md border-border rounded-md border">
            <MenuItem.Action
              icon="user"
              label="Agent"
              value="Ravi Mukti"
              onPress={() => {}}
            />
            <Divider className="-mx-lg" />
            <MenuItem.Action
              icon="userSettings"
              label="Assignee"
              value="Hazkia"
              onPress={() => {}}
            />
            <Divider className="-mx-lg" />
            <MenuItem.Action
              icon="signal"
              label="Priority"
              value="High"
              onPress={() => {}}
            />
          </View>

          <View className="gap-sm">
            <Text variant="labelM">Participants</Text>
            <View className="bg-surface px-lg py-md gap-md border-border rounded-md border">
              <MenuItem.Action
                icon="user"
                label="Ravi Mukti"
                onPress={() => {}}
              />
            </View>
          </View>

          <View className="gap-sm">
            <Text variant="labelM">Attributes</Text>
            <View className="bg-surface px-lg py-md gap-md border-border rounded-md border">
              <MenuItem.Action
                label="Conversation ID"
                value="2"
                rightElement={null}
              />
              <Divider className="-mx-lg" />
              <MenuItem.Action
                label="Initiated at"
                value="18/02/2025"
                rightElement={null}
              />
              <Divider className="-mx-lg" />
              <MenuItem.Action
                label="Browser"
                value="Chrome 133.0.0.0"
                rightElement={null}
              />
              <Divider className="-mx-lg" />
              <MenuItem.Action
                label="Operating System"
                value="macOS 10.15.7"
                rightElement={null}
              />
              <Divider className="-mx-lg" />
              <MenuItem.Action
                label="IP Address"
                value="127.0.0.1"
                rightElement={null}
              />
            </View>
          </View>
          <Button
            text="Share Conversation"
            onPress={() => {}}
            color="primary"
            variant="outlined"
          />
        </View>
      </PagerView>
    </Container>
  );
}
