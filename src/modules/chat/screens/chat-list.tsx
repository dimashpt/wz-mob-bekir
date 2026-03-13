import React, { JSX, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

import { Illustrations } from '@/assets/illustrations';
import {
  Button,
  Checkbox,
  Container,
  Filter,
  OptionBottomSheetRef,
  Skeleton,
  Text,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { screenHeight, screenWidth } from '@/hooks';
import ChatListItem from '../components/chat-list-item';
import {
  getAssigneeFilterOptions,
  getSortFilterOptions,
  getStatusFilterOptions,
} from '../constants/options';
import { useListConversationQuery } from '../services/conversation/repository';
import { ListConversationsParams } from '../services/conversation/types';
import { useListInboxesQuery } from '../services/inbox/repository';

export default function ChatScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const accentColor = useCSSVariable('--color-accent') as string;

  const [showFilters, setShowFilters] = useState(false);
  const [filters, _setFilters] = useState<ListConversationsParams>({
    // page: 1,
    // assignee_type: 'me',
    status: 'open',
    // sort_by: 'latest',
  });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const labelsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const assigneeBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const statusBottomSheetRef = useRef<OptionBottomSheetRef>(null);

  const STATUS_OPTIONS = getStatusFilterOptions();
  const ASSIGNEE_OPTIONS = getAssigneeFilterOptions();
  const SORT_OPTIONS = getSortFilterOptions();

  const { data, isLoading, isRefetching, refetch } = useListConversationQuery(
    {},
    filters,
  );

  const conversations = data?.data ?? [];

  const { data: inboxes } = useListInboxesQuery({
    select: (data) =>
      (data.payload ?? []).map((inbox) => ({
        label: inbox.name,
        value: String(inbox.id),
        data: inbox,
      })),
  });

  function setFilters(newFilters: Partial<ListConversationsParams>): void {
    const finalFilters = { ...filters, ...newFilters };

    Object.keys(finalFilters).forEach((key) => {
      if (
        ['', undefined, null].includes(
          finalFilters[key as keyof ListConversationsParams] as string,
        )
      ) {
        delete finalFilters[key as keyof ListConversationsParams];
      }
    });

    _setFilters(finalFilters);
  }

  function handleItemPress(itemId: number): void {
    if (isSelectionMode) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }
  }

  function handleItemLongPress(itemId: number): void {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds(new Set([itemId]));
    }
  }

  function exitSelectionMode(): void {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }

  const allItemIds = conversations.map((item) => item.id);
  const isAllSelected =
    isSelectionMode &&
    allItemIds.length > 0 &&
    allItemIds.every((id) => selectedIds.has(id));

  function handleSelectAll(): void {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allItemIds));
    }
  }

  return (
    <Container
      className="bg-background p-lg gap-md flex-1"
      style={{ paddingTop: insets.top + 20 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="gap-md flex-row items-center">
          {isSelectionMode && (
            <Checkbox
              isSelected={isAllSelected}
              size="medium"
              className="bg-surface"
              onPress={handleSelectAll}
            />
          )}
          <Text variant={isSelectionMode ? 'headingXS' : 'headingL'}>
            {isSelectionMode ? `${selectedIds.size} selected` : t('chat.title')}
          </Text>
        </View>
        {isSelectionMode ? (
          <Button text="Cancel" variant="ghost" onPress={exitSelectionMode} />
        ) : (
          <Button
            icon={showFilters ? 'close' : 'filter'}
            variant="ghost"
            onPress={() => setShowFilters(!showFilters)}
          />
        )}
      </View>
      {showFilters && !isSelectionMode && (
        <Filter
          hideClearAll
          scrollViewProps={{
            contentContainerClassName: 'px-lg',
            className: '-mx-lg',
          }}
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
            value={filters.inbox_id ?? ''}
            onChange={(value) =>
              setFilters({
                inbox_id: value as ListConversationsParams['inbox_id'],
              })
            }
            options={[
              { label: t('chat.filters.all'), value: '' },
              ...(inboxes ?? []),
            ]}
          />
        </Filter>
      )}
      <FlatList
        data={conversations}
        keyExtractor={(item) => `conversation-${item.id}`}
        className="flex-1"
        contentContainerClassName="flex-1 gap-sm"
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        scrollEnabled={!isLoading}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatListItem
            item={item}
            index={index}
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds.has(item.id)}
            onPress={
              isSelectionMode ? () => handleItemPress(item.id) : undefined
            }
            onLongPress={() => handleItemLongPress(item.id)}
            handleUnread={() => {}}
          />
        )}
        ListEmptyComponent={() => (
          <View className="gap-sm flex-1 items-center">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))
            ) : (
              <View className="gap-sm px-xl pb-tab-bar flex-1 items-center justify-center">
                <Illustrations.NoData
                  color={accentColor}
                  width={screenWidth / 3}
                  height={screenHeight / 3}
                />
                <View className="gap-xs items-center">
                  <Text variant="headingS" className="text-center">
                    {t('chat.no_conversations')}
                  </Text>
                  <Text
                    variant="bodyM"
                    className="text-muted-foreground text-center"
                  >
                    {t('chat.no_conversations_description')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
      {isSelectionMode && (
        <View
          className="gap-sm py-sm absolute right-0 left-0 flex-row justify-center"
          style={{
            bottom: TAB_BAR_HEIGHT,
          }}
        >
          <Button
            icon="tag"
            variant="outlined"
            disabled={selectedIds.size === 0}
            onPress={() => labelsBottomSheetRef.current?.present()}
          />
          <Button
            icon="userSettings"
            variant="outlined"
            disabled={selectedIds.size === 0}
            onPress={() => assigneeBottomSheetRef.current?.present()}
          />
          <Button
            icon="slider"
            variant="outlined"
            disabled={selectedIds.size === 0}
            onPress={() => statusBottomSheetRef.current?.present()}
          />
        </View>
      )}
    </Container>
  );
}
