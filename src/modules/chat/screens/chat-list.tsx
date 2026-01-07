import React, { JSX, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Checkbox,
  Container,
  Filter,
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
  Skeleton,
  Text,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useAuthStore } from '@/store';
import ChatListItem from '../components/chat-list-item';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import {
  getAssigneeFilterOptions,
  getBulkStatusOptions,
  getSortFilterOptions,
  getStatusFilterOptions,
} from '../constants/options';
import { bulkUpdateAction, unreadConversation } from '../services/conversation';
import { useListAssignableAgentsQuery } from '../services/conversation-room/repository';
import {
  useListConversationQuery,
  useListLabelsQuery,
} from '../services/conversation/repository';
import {
  BulkUpdateActionPayload,
  ConversationStatus,
  Label,
  ListConversationsParams,
  ListConversationsResponse,
} from '../services/conversation/types';

export default function ChatScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { chatUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, _setFilters] = useState<ListConversationsParams>({
    page: 1,
    assignee_type: 'me',
    status: 'open',
    sort_by: 'latest',
  });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const labelsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const assigneeBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const statusBottomSheetRef = useRef<OptionBottomSheetRef>(null);

  const STATUS_OPTIONS = getStatusFilterOptions();
  const ASSIGNEE_OPTIONS = getAssigneeFilterOptions();
  const SORT_OPTIONS = getSortFilterOptions();
  const BULK_STATUS_OPTIONS = getBulkStatusOptions();

  const { data, isLoading, isRefetching, refetch } = useListConversationQuery(
    {},
    filters,
  );

  const conversations = data?.data?.payload ?? [];
  const selectedConversations = conversations.filter((conv) =>
    selectedIds.has(conv.uuid),
  );
  const uniqueInboxIds = useMemo(
    () =>
      Array.from(
        new Set(selectedConversations.map((conv) => conv.inbox_id)),
      ).filter((id) => id > 0),
    [selectedConversations],
  );

  const { data: labels } = useListLabelsQuery({
    select: (data) =>
      (data.payload ?? []).map((label) => ({
        label: label.title,
        value: label.title,
        data: label,
      })),
  });

  const { data: agents } = useListAssignableAgentsQuery(
    {
      enabled: isSelectionMode && uniqueInboxIds.length > 0,
      select: (data) =>
        (data.payload ?? []).map((agent) => ({
          label: agent.name,
          value: String(agent.id),
          data: agent,
        })),
    },
    {
      inbox_ids: uniqueInboxIds,
    },
  );

  const selectedConversationIds = selectedConversations.map((conv) => conv.id);

  const listConversationsQueryKey = [
    CONVERSATIONS_ENDPOINTS.LIST_CONVERSATIONS(chatUser?.account_id ?? 0),
    filters,
  ];

  const bulkUpdateMutation = useMutation({
    mutationFn: (payload: BulkUpdateActionPayload) =>
      bulkUpdateAction(chatUser?.account_id ?? 0, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listConversationsQueryKey });
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    },
  });

  function handleBulkUpdateLabels(selectedLabels: Option<Label>[]): void {
    if (selectedConversationIds.length === 0) return;

    labelsBottomSheetRef.current?.close();

    bulkUpdateMutation.mutate({
      ids: selectedConversationIds,
      type: 'Conversation',
      labels: {
        add: selectedLabels.map((label) => label.value),
      },
    });
  }

  function handleBulkUpdateAssignee(option: Option): void {
    if (selectedConversationIds.length === 0) return;

    assigneeBottomSheetRef.current?.close();

    const assigneeId = Number(option.value);
    const payload: BulkUpdateActionPayload = {
      ids: selectedConversationIds,
      type: 'Conversation',
    };

    if (assigneeId === 0) {
      // Unassign - set assignee_id to 0 or omit it based on API behavior
      // Check API docs, but typically unassigning might require a different approach
      // For now, we'll set it to 0
      payload.fields = { assignee_id: 0 };
    } else {
      payload.fields = { assignee_id: assigneeId };
    }

    bulkUpdateMutation.mutate(payload);
  }

  function handleBulkUpdateStatus(option: Option<ConversationStatus>): void {
    if (selectedConversationIds.length === 0) return;

    statusBottomSheetRef.current?.close();

    bulkUpdateMutation.mutate({
      ids: selectedConversationIds,
      type: 'Conversation',
      fields: {
        status: option.value as ConversationStatus,
      },
    });
  }

  function setFilters(newFilters: Partial<ListConversationsParams>): void {
    _setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  function handleItemPress(itemUuid: string): void {
    if (isSelectionMode) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemUuid)) {
          newSet.delete(itemUuid);
        } else {
          newSet.add(itemUuid);
        }
        return newSet;
      });
    }
  }

  function handleItemLongPress(itemUuid: string): void {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds(new Set([itemUuid]));
    }
  }

  function exitSelectionMode(): void {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }

  const allItemUuids = conversations.map((item) => item.uuid);
  const isAllSelected =
    isSelectionMode &&
    allItemUuids.length > 0 &&
    allItemUuids.every((uuid) => selectedIds.has(uuid));

  function handleSelectAll(): void {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allItemUuids));
    }
  }

  const unreadConversationMutation = useMutation({
    mutationKey: ['unread-conversation'],
    mutationFn: (conversationId: number) =>
      unreadConversation(chatUser?.account_id ?? 0, conversationId),
    onSuccess: (data, payload, __, context) => {
      context.client.setQueryData(
        listConversationsQueryKey,
        (old: ListConversationsResponse) => {
          return {
            ...old,
            data: {
              ...old.data,
              payload: old.data.payload.map((item) =>
                item.id === payload ? data : item,
              ),
            },
          };
        },
      );
    },
  });

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
          <ChatListItem
            item={item}
            index={index}
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds.has(item.uuid)}
            onPress={
              isSelectionMode ? () => handleItemPress(item.uuid) : undefined
            }
            onLongPress={() => handleItemLongPress(item.uuid)}
            handleUnread={() => unreadConversationMutation.mutate(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <View className="gap-sm flex-1">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
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
      <OptionBottomSheet
        ref={labelsBottomSheetRef}
        options={labels ?? []}
        title={t('chat.labels.title')}
        multiselect
        onSelect={(selectedLabels) =>
          handleBulkUpdateLabels(selectedLabels as Option<Label>[])
        }
        selectedValues={[]}
      />
      <OptionBottomSheet
        ref={assigneeBottomSheetRef}
        options={[
          {
            label: t('chat.assignment.priority_none'),
            value: String(0),
            data: {} as import('../services/conversation-room/types').Agent,
          },
          ...(agents ?? []),
        ]}
        title={t('chat.assignment.agent')}
        onSelect={(option) => handleBulkUpdateAssignee(option as Option)}
      />
      <OptionBottomSheet
        ref={statusBottomSheetRef}
        options={BULK_STATUS_OPTIONS}
        title={t('chat.filters.status_label')}
        onSelect={(option) =>
          handleBulkUpdateStatus(option as Option<ConversationStatus>)
        }
      />
    </Container>
  );
}
