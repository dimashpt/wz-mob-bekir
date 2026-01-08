import React, { JSX, useMemo, useRef } from 'react';
import { View } from 'react-native';

import { InfiniteData, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Chip,
  Clickable,
  Icon,
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
  Text,
} from '@/components';
import { useAuthStore } from '@/store/auth-store';
import { conversationKeys } from '../constants/keys';
import { updateLabels } from '../services/conversation';
import {
  Conversation,
  ConversationMessagesResponse,
  ConversationMeta,
  UpdateLabelConversationPayload,
} from '../services/conversation/types';
import { useListLabelsQuery } from '../services/label/repository';
import { Label } from '../services/label/types';

type LabelsSectionProps = {
  meta?: ConversationMeta;
  conversation?: Conversation;
  labels?: Option<Label>[];
};

export function LabelsSection({
  meta,
  conversation,
}: LabelsSectionProps): JSX.Element {
  const labelsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const { chatUser } = useAuthStore();
  const { t } = useTranslation();

  const { data: labels } = useListLabelsQuery({
    select: (data) =>
      (data.payload ?? []).map((label) => ({
        label: label.title,
        value: label.title,
        data: label,
      })),
  });

  const listMessagesQueryKey = conversationKeys.messages(
    chatUser?.account_id ?? 0,
    conversation?.id?.toString() ?? '',
  );

  const updateLabelsMutation = useMutation({
    mutationKey: conversationKeys.updateLabels,
    mutationFn: (payload: UpdateLabelConversationPayload) =>
      updateLabels(chatUser?.account_id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: listMessagesQueryKey });

      const previousAssignee =
        context.client.getQueryData<ConversationMessagesResponse>(
          listMessagesQueryKey,
        );

      context.client.setQueryData(
        listMessagesQueryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          const newPages = old.pages.map((page) => ({
            ...page,
            meta: {
              ...page.meta,
              labels: payload.labels,
            },
          }));
          return { ...old, pages: newPages };
        },
      );

      return { previousAssignee };
    },
  });

  function onChangeLabels(labels: Option<Label>[]): void {
    updateLabelsMutation.mutate({ labels: labels.map((label) => label.value) });
  }

  const selectedLabels = useMemo(
    () => labels?.filter((label) => meta?.labels?.includes(label.value)),
    [labels, meta?.labels],
  );

  return (
    <>
      <View className="gap-sm">
        <Text variant="labelM">{t('chat.labels.title')}</Text>

        <View className="gap-sm flex-row flex-wrap">
          {meta?.labels.map((label) => (
            <Chip
              key={label}
              label={label}
              variant="gray"
              textProps={{
                className: 'text-sm font-medium android:font-map-medium',
              }}
              prefix={
                <View
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor:
                      labels?.find((l) => l.data?.title === label)?.data
                        ?.color ?? '#gray',
                  }}
                />
              }
            />
          ))}
          <Clickable onPress={() => labelsBottomSheetRef.current?.present()}>
            <Chip
              label={t('chat.labels.add_label')}
              variant="clear"
              textProps={{
                className: 'text-sm font-medium android:font-map-medium',
              }}
              prefix={
                <Icon name="plus" size="sm" className="text-foreground" />
              }
            />
          </Clickable>
        </View>
      </View>

      <OptionBottomSheet
        ref={labelsBottomSheetRef}
        options={labels ?? []}
        title={t('chat.labels.title')}
        multiselect
        onSelect={(opts) => onChangeLabels(opts)}
        selectedValues={selectedLabels}
      />
    </>
  );
}
