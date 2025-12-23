import React, { JSX, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Container,
  Filter,
  Option,
  Skeleton,
  Text,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import ChatListItem from '../components/chat-list-item';
import { useListConversationQuery } from '../services/conversation/repository';
import { ListConversationsParams } from '../services/conversation/types';

export default function ChatScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, _setFilters] = useState<ListConversationsParams>({
    assignee_type: 'all',
    status: 'all',
    sort_by: 'latest',
    inbox_id: undefined,
  });

  const STATUS_OPTIONS: Option[] = useMemo(
    () => [
      { label: t('chat.filters.all'), value: 'all' },
      { label: t('chat.status.open'), value: 'open' },
      { label: t('chat.status.pending'), value: 'pending' },
      { label: t('chat.status.snooze'), value: 'snoozed' },
      { label: t('chat.status.resolve'), value: 'resolved' },
    ],
    [t],
  );

  const ASSIGNEE_OPTIONS: Option[] = useMemo(
    () => [
      { label: t('chat.filters.all'), value: 'all' },
      { label: t('chat.filters.me'), value: 'me' },
      { label: t('chat.filters.unassigned'), value: 'unassigned' },
    ],
    [t],
  );

  const SORT_OPTIONS: Option[] = useMemo(
    () => [
      { label: t('chat.filters.latest'), value: 'latest' },
      {
        label: t('chat.filters.sort_on_created_at'),
        value: 'sort_on_created_at',
      },
      { label: t('chat.filters.sort_on_priority'), value: 'sort_on_priority' },
    ],
    [t],
  );

  const { data, isLoading, isRefetching, refetch } = useListConversationQuery(
    {},
    filters,
  );

  function setFilters(newFilters: Partial<ListConversationsParams>): void {
    _setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  return (
    <Container
      className="bg-background p-lg flex-1"
      style={{ paddingTop: insets.top + 20 }}
    >
      <View className="flex-row items-center justify-between">
        <Text variant="headingL" className="mb-lg">
          {t('chat.title')}
        </Text>
        <Button
          icon={showFilters ? 'close' : 'filter'}
          variant="ghost"
          onPress={() => setShowFilters(!showFilters)}
        />
      </View>
      {showFilters && (
        <Filter
          scrollViewProps={{
            contentContainerClassName: 'px-lg',
            className: '-mx-lg mb-sm',
          }}
          hideClearAll
        >
          <Filter.Options
            name="status"
            label={t('chat.filters.status_label')}
            value={filters.status}
            onChange={(value) =>
              setFilters({ status: value as ListConversationsParams['status'] })
            }
            options={STATUS_OPTIONS}
          />
          <Filter.Options
            name="assignee_type"
            label={t('chat.filters.assignee_label')}
            value={filters.assignee_type}
            onChange={(value) =>
              setFilters({
                assignee_type:
                  value as ListConversationsParams['assignee_type'],
              })
            }
            options={ASSIGNEE_OPTIONS}
          />
          <Filter.Options
            name="sort_by"
            label={t('chat.filters.sort_by_label')}
            value={filters.sort_by}
            onChange={(value) =>
              setFilters({
                sort_by: value as ListConversationsParams['sort_by'],
              })
            }
            options={SORT_OPTIONS}
          />
          <Filter.Options
            name="inbox_id"
            label={t('chat.filters.inbox_label')}
            value={filters.inbox_id}
            onChange={(value) =>
              setFilters({
                inbox_id: value as ListConversationsParams['inbox_id'],
              })
            }
            options={[]}
          />
        </Filter>
      )}
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
