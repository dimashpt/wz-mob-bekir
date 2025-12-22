import React, { JSX } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, Skeleton, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import ChatListItem from '../components/chat-list-item';
import { useListConversationQuery } from '../services/conversation/repository';

export default function ChatScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isRefetching, refetch } = useListConversationQuery();

  return (
    <Container
      className="bg-background p-lg flex-1"
      style={{ paddingTop: insets.top + 20 }}
    >
      <Text variant="headingL" className="mb-lg">
        {t('chat.title')}
      </Text>
      <FlatList
        data={data?.data?.payload ?? []}
        keyExtractor={(item) => item.uuid}
        className="flex-1"
        contentContainerClassName="flex-1 gap-sm"
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        scrollEnabled={!isLoading}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatListItem item={item} index={index} />
        )}
        ListEmptyComponent={() => (
          <View className="gap-sm flex-1">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-16" />
                ))
              : null}
          </View>
        )}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </Container>
  );
}
