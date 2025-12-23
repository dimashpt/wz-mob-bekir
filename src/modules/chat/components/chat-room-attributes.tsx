import React, { JSX, useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';

import { InfiniteData, useMutation } from '@tanstack/react-query';
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
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
  Text,
} from '@/components';
import { useAuthStore } from '@/store/auth-store';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import {
  updateAssignee,
  updateLabels,
  updateParticipants,
  updatePriority,
  updateStatus,
} from '../services/conversation';
import {
  useListAssignableAgentsQuery,
  useListParticipantsQuery,
  useListTeamsQuery,
} from '../services/conversation-room/repository';
import {
  Agent,
  ConversationMessagesResponse,
  ConversationParticipantsResponse,
  Meta,
  Team,
} from '../services/conversation-room/types';
import { useListLabelsQuery } from '../services/conversation/repository';
import {
  Conversation,
  ConversationPriority,
  ConversationStatus,
  Label,
  UpdateAssigneePayload,
  UpdateAssigneeTeamPayload,
  UpdateLabelConversationPayload,
  UpdateParticipantsPayload,
  UpdatePriorityPayload,
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

const PRIORITY_OPTIONS: { label: string; value: ConversationPriority }[] = [
  { label: 'None', value: 'none' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

export function ChatRoomAttributes({
  meta,
  conversation,
}: ChatRoomAttributesProps): JSX.Element {
  const priorityBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const agentsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const teamsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const labelsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const participantsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const { chatUser } = useAuthStore();
  const { data: participants, ...participantsQuery } = useListParticipantsQuery(
    undefined,
    conversation?.id?.toString() ?? '',
  );
  const { data: agents } = useListAssignableAgentsQuery(
    {
      enabled: Boolean(conversation?.id),
      select: (data) =>
        (data.payload ?? []).map((agent) => ({
          label: agent.name,
          value: String(agent.id),
          data: agent,
        })),
    },
    {
      inbox_ids: [conversation?.inbox_id ?? 0],
    },
  );
  const { data: teams } = useListTeamsQuery({
    select: (data) => [
      { label: 'None', value: String(0), data: {} as Team },
      ...(data ?? []).map((team) => ({
        label: team.name,
        value: String(team.id),
        data: team,
      })),
    ],
  });
  const { data: labels } = useListLabelsQuery({
    select: (data) =>
      (data.payload ?? []).map((label) => ({
        label: label.title,
        value: label.title,
        data: label,
      })),
  });

  const updateLastSeenQueryKey = [
    CONVERSATIONS_ENDPOINTS.UPDATE_LAST_SEEN(
      chatUser?.account_id ?? 0,
      conversation?.id?.toString() ?? '',
    ),
  ];
  const listMessagesQueryKey = [
    CONVERSATIONS_ENDPOINTS.MESSAGES(
      chatUser?.account_id ?? 0,
      conversation?.id?.toString() ?? '',
    ),
    'infinite',
  ];
  const listParticipantsQueryKey = [
    CONVERSATIONS_ENDPOINTS.PARTICIPANTS(
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

  const updateAssigneeMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_ASSIGNEE(
        chatUser?.account_id ?? 0,
        conversation?.id ?? 0,
      ),
    ],
    mutationFn: (payload: UpdateAssigneePayload) =>
      updateAssignee(chatUser?.account_id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: listMessagesQueryKey });

      const previousAssignee =
        context.client.getQueryData<ConversationMessagesResponse>(
          listMessagesQueryKey,
        );
      const assignedAgent = agents?.find(
        (agent) => agent.value === payload.assignee_id.toString(),
      );

      context.client.setQueryData(
        listMessagesQueryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          // Change the first page of the messages to include the new assignee
          const newPages = old.pages.map((page) => ({
            ...page,
            meta: {
              ...page.meta,
              assignee: assignedAgent?.data,
            },
          }));
          return { ...old, pages: newPages };
        },
      );

      return { previousAssignee };
    },
  });

  const updateAssigneeTeamMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_ASSIGNEE(
        chatUser?.account_id ?? 0,
        conversation?.id ?? 0,
      ),
    ],
    mutationFn: (payload: UpdateAssigneeTeamPayload) =>
      updateAssignee(chatUser?.account_id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: updateLastSeenQueryKey });

      const previousTeam = context.client.getQueryData<Conversation>(
        updateLastSeenQueryKey,
      );

      context.client.setQueryData(
        updateLastSeenQueryKey,
        (old: Conversation) => ({
          ...old,
          meta: {
            ...old.meta,
            team: teams?.find(
              (team) => team.value === payload.team_id.toString(),
            )?.data,
          },
        }),
      );

      return { previousTeam };
    },
  });

  const updatePriorityMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_PRIORITY(
        chatUser?.account_id ?? 0,
        conversation?.id ?? 0,
      ),
    ],
    mutationFn: (payload: UpdatePriorityPayload) =>
      updatePriority(chatUser?.account_id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: updateLastSeenQueryKey });

      const previousPriority = context.client.getQueryData<Conversation>(
        updateLastSeenQueryKey,
      );

      context.client.setQueryData(
        updateLastSeenQueryKey,
        (old: Conversation) => ({
          ...old,
          priority: payload.priority,
        }),
      );

      return { previousPriority };
    },
  });

  const updateLabelsMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_LABELS(
        chatUser?.account_id ?? 0,
        conversation?.id ?? 0,
      ),
    ],
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
          // Change the first page of the messages to include the new assignee
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

  const updateParticipantsMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.PARTICIPANTS(
        chatUser?.account_id ?? 0,
        conversation?.id?.toString() ?? '',
      ),
    ],
    mutationFn: (payload: UpdateParticipantsPayload) =>
      updateParticipants(
        chatUser?.account_id ?? 0,
        conversation?.id?.toString() ?? '',
        payload,
      ),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({
        queryKey: listParticipantsQueryKey,
      });

      const previousParticipants = context.client.getQueryData<
        ConversationParticipantsResponse[]
      >(listParticipantsQueryKey);

      context.client.setQueryData(
        listParticipantsQueryKey,
        (_: ConversationParticipantsResponse[]) =>
          payload.user_ids.map((userId) => {
            const participant = agents?.find(
              (agent) => agent.value === String(userId),
            );

            return participant?.data;
          }) ?? [],
      );

      return { previousParticipants };
    },
    onSuccess: () => participantsQuery.refetch(),
  });

  const additionalAttributes = meta?.additional_attributes;
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

  function onChangeAgent(agentId: string): void {
    updateAssigneeMutation.mutate({ assignee_id: Number(agentId) });
  }

  function onChangeTeam(teamId: string): void {
    updateAssigneeTeamMutation.mutate({ team_id: Number(teamId) });
  }

  function onChangePriority(priority: ConversationPriority): void {
    updatePriorityMutation.mutate({ priority: priority });
  }

  function onChangeLabels(labels: Option<Label>[]): void {
    updateLabelsMutation.mutate({ labels: labels.map((label) => label.value) });
  }

  function onChangeParticipants(participants: Option<Agent>[]): void {
    updateParticipantsMutation.mutate({
      user_ids: participants.map((participant) => Number(participant.value)),
    });
  }

  const selectedLabels = useMemo(
    () => labels?.filter((label) => meta?.labels?.includes(label.value)),
    [labels, meta?.labels],
  );

  return (
    <Container.Scroll contentContainerClassName="p-lg gap-md">
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
          loading={updateAssigneeMutation.isPending}
          value={meta?.assignee?.name}
          onPress={() => agentsBottomSheetRef.current?.present()}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="userSettings"
          label="Assignee"
          loading={updateAssigneeTeamMutation.isPending}
          value={conversation?.meta?.team?.name}
          onPress={() => teamsBottomSheetRef.current?.present()}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="signal"
          label="Priority"
          loading={updatePriorityMutation.isPending}
          value={
            PRIORITY_OPTIONS.find(
              (opt) =>
                opt.value === (conversation?.priority ?? 'none').toLowerCase(),
            )?.label ?? '-'
          }
          onPress={() => priorityBottomSheetRef.current?.present()}
        />
      </Container.Card>

      <View className="gap-sm">
        <Text variant="labelM">Labels</Text>

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
                    backgroundColor: labels?.find((l) => l.data.title === label)
                      ?.data.color,
                  }}
                />
              }
            />
          ))}
          <Clickable onPress={() => labelsBottomSheetRef.current?.present()}>
            <Chip
              label="Add Label"
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

      <View className="gap-sm">
        <Text variant="labelM">Participants</Text>
        <Container.Card className={participants?.length ? 'gap-sm' : 'gap-0'}>
          <FlatList
            data={participants}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <MenuItem.Action
                key={item.id}
                icon="user"
                label={item.name}
                value={item.availability_status}
                rightElement={null}
              />
            )}
            ItemSeparatorComponent={() => <Divider className="-mx-md" />}
          />
          {participants?.length ? <Divider className="-mx-md" /> : null}
          <MenuItem.Action
            icon="plus"
            label="Add Participant"
            rightElement={null}
            onPress={() => participantsBottomSheetRef.current?.present()}
          />
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

      <OptionBottomSheet
        ref={agentsBottomSheetRef}
        options={[
          { label: 'None', value: String(0), data: {} as Agent },
          ...(agents ?? []),
        ]}
        title="Agent"
        onSelect={(opt) => onChangeAgent(opt.value)}
        selectedValue={agents?.find(
          (agent) => agent.value === (meta?.assignee?.id ?? 0).toString(),
        )}
      />

      <OptionBottomSheet
        ref={teamsBottomSheetRef}
        options={teams ?? []}
        title="Team"
        onSelect={(opt) => onChangeTeam(opt.value)}
        selectedValue={teams?.find(
          (team) =>
            team.value === (conversation?.meta?.team?.id ?? 0).toString(),
        )}
      />

      <OptionBottomSheet
        ref={priorityBottomSheetRef}
        options={PRIORITY_OPTIONS}
        title="Priority"
        onSelect={(opt) => onChangePriority(opt.value as ConversationPriority)}
        selectedValue={PRIORITY_OPTIONS.find(
          (opt) =>
            opt.value === (conversation?.priority ?? 'none').toLowerCase(),
        )}
      />

      <OptionBottomSheet
        ref={labelsBottomSheetRef}
        options={labels ?? []}
        title="Labels"
        multiselect
        onSelect={(opts) => onChangeLabels(opts)}
        selectedValues={selectedLabels}
      />

      <OptionBottomSheet
        ref={participantsBottomSheetRef}
        options={agents ?? []}
        title="Participants"
        multiselect
        onSelect={(opts) => onChangeParticipants(opts)}
        selectedValues={participants?.map((participant) => ({
          label: participant.name,
          value: String(participant.id),
          data: participant,
        }))}
      />
    </Container.Scroll>
  );
}
