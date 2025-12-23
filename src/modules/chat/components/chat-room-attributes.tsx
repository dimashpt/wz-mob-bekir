import React, { JSX } from 'react';
import { View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { tv } from 'tailwind-variants';

import {
  Button,
  Chip,
  Clickable,
  Container,
  Divider,
  Icon,
  IconNames,
  MenuItem,
  Text,
} from '@/components';
import { useAuthStore } from '@/store/auth-store';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import { updateStatus } from '../services/conversation';
import { useListParticipantsQuery } from '../services/conversation-room/repository';
import { Meta } from '../services/conversation-room/types';
import {
  Conversation,
  ConversationStatus,
  UpdateStatusPayload,
} from '../services/conversation/types';

type ChatRoomAttributesProps = {
  meta?: Meta;
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

export function ChatRoomAttributes({
  meta,
  conversation,
}: ChatRoomAttributesProps): JSX.Element {
  const { chatUser } = useAuthStore();
  const { data: participants } = useListParticipantsQuery(
    undefined,
    conversation?.id?.toString() ?? '',
  );

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
      const queryKey = [
        CONVERSATIONS_ENDPOINTS.UPDATE_LAST_SEEN(
          chatUser?.account_id ?? 0,
          conversation?.id?.toString() ?? '',
        ),
      ];
      await context.client.cancelQueries({ queryKey });

      const previousStatus =
        context.client.getQueryData<Conversation>(queryKey);

      context.client.setQueryData(queryKey, (old: Conversation) => ({
        ...old,
        status: payload.status,
      }));

      return { previousStatus };
    },
  });

  const additionalAttributes = meta?.additional_attributes;
  const labels = meta?.labels ?? [];
  const initiatedAt = additionalAttributes?.initiated_at?.timestamp;
  const browser = additionalAttributes?.browser;

  const browserName = browser?.browser_name
    ? `${browser?.browser_name} ${browser?.browser_version}`
    : '';
  const platformName = browser?.platform_name
    ? `${browser?.platform_name} ${browser?.platform_version}`
    : '';

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
    <Container.Scroll contentContainerClassName="p-lg gap-md flex-1">
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
      <Container.Card>
        <MenuItem.Action
          icon="user"
          label="Agent"
          value={meta?.assignee?.name}
          onPress={() => {}}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="userSettings"
          label="Assignee"
          value={conversation?.meta?.team?.name}
          onPress={() => {}}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="signal"
          label="Priority"
          value="High"
          onPress={() => {}}
        />
      </Container.Card>

      <View className="gap-sm">
        <Text variant="labelM">Labels</Text>

        <View className="gap-sm flex-row flex-wrap">
          {labels.map((label) => (
            <Chip
              key={label}
              label={label}
              variant="gray"
              textProps={{
                className: 'text-sm font-medium android:font-map-medium',
              }}
            />
          ))}
        </View>
      </View>

      <View className="gap-sm">
        <Text variant="labelM">Participants</Text>
        <Container.Card>
          {participants?.map((participant) => (
            <MenuItem.Action
              key={participant.id}
              icon="user"
              label={participant.name}
              value={participant.availability_status}
              rightElement={null}
            />
          ))}
        </Container.Card>
      </View>

      <View className="gap-sm">
        <Text variant="labelM">Attributes</Text>
        <Container.Card>
          <MenuItem.Action
            label="Conversation ID"
            value={conversation?.id?.toString()}
            rightElement={null}
          />
          <Divider className="-mx-lg" />
          <MenuItem.Action
            label="Initiated at"
            value={dayjs(initiatedAt).format('DD/MM/YYYY HH:mm')}
            rightElement={null}
          />
          <Divider className="-mx-lg" />
          <MenuItem.Action
            label="Browser"
            value={browserName}
            rightElement={null}
          />
          <Divider className="-mx-lg" />
          <MenuItem.Action
            label="Operating System"
            value={platformName}
            rightElement={null}
          />
          <Divider className="-mx-lg" />
          <MenuItem.Action
            label="IP Address"
            value="127.0.0.1"
            rightElement={null}
          />
        </Container.Card>
      </View>

      <Button
        text="Share Conversation"
        onPress={() => {}}
        color="primary"
        variant="outlined"
      />
    </Container.Scroll>
  );
}
