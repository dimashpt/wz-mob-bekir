import React, { JSX } from 'react';
import { View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { tv } from 'tailwind-variants';

import { Clickable, Icon, IconNames, Text } from '@/components';
import { useAuthStore } from '@/store/auth-store';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import { updateStatus } from '../services/conversation';
import {
  Conversation,
  ConversationStatus,
  UpdateStatusPayload,
} from '../services/conversation/types';

type StatusSectionProps = {
  conversation?: Conversation;
};

const statusVariants = tv({
  base: 'gap-sm bg-surface px-md py-4xl flex-1 items-center justify-center rounded-md border',
  variants: {
    variant: {
      open: 'bg-accent-soft border-accent',
      pending: 'bg-warning-soft border-warning',
      snoozed: 'bg-info-soft border-info',
      resolved: 'bg-success-soft border-success',
    },
    active: {
      true: 'border-accent',
      false: 'border-transparent',
    },
  },
  defaultVariants: {
    variant: 'open',
    active: false,
  },
});

export function StatusSection({
  conversation,
}: StatusSectionProps): JSX.Element {
  const { chatUser } = useAuthStore();

  const updateLastSeenQueryKey = [
    CONVERSATIONS_ENDPOINTS.UPDATE_LAST_SEEN(
      chatUser?.account_id ?? 0,
      conversation?.id?.toString() ?? '',
    ),
  ];

  const updateStatusMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_STATUS(
        chatUser?.account_id ?? 0,
        conversation?.id ?? 0,
      ),
    ],
    mutationFn: (payload: UpdateStatusPayload) =>
      updateStatus(chatUser?.account_id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: updateLastSeenQueryKey });

      const previousStatus = context.client.getQueryData<Conversation>(
        updateLastSeenQueryKey,
      );

      context.client.setQueryData(
        updateLastSeenQueryKey,
        (old: Conversation) => ({
          ...old,
          status: payload.status,
        }),
      );

      return { previousStatus };
    },
  });

  const statusList: {
    label: string;
    value: ConversationStatus;
    icon: IconNames;
    active: boolean;
  }[] = [
    {
      label: 'Open',
      value: 'open',
      icon: 'refresh',
      active: conversation?.status === 'open',
    },
    {
      label: 'Pending',
      value: 'pending',
      icon: 'clock',
      active: conversation?.status === 'pending',
    },
    {
      label: 'Snooze',
      value: 'snoozed',
      icon: 'notification',
      active: conversation?.status === 'snoozed',
    },
    {
      label: 'Resolve',
      value: 'resolved',
      icon: 'tickCircle',
      active: conversation?.status === 'resolved',
    },
  ];

  function onChangeStatus(status: ConversationStatus): void {
    updateStatusMutation.mutate({ status });
  }

  return (
    <View className="gap-sm flex-row">
      {statusList.map((status) => (
        <Clickable
          key={status.label}
          className={statusVariants({
            variant: status.value,
            active: status.active,
          })}
          onPress={() => onChangeStatus(status.value)}
        >
          <Icon name={status.icon} size="lg" className="text-foreground" />
          <Text variant="labelS">{status.label}</Text>
        </Clickable>
      ))}
    </View>
  );
}
