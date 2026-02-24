import React, { JSX, useRef } from 'react';

import { InfiniteData, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Container,
  Divider,
  MenuItem,
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '@/components';
import { optimisticUpdateQuery } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth-store';
import { conversationKeys } from '../constants/keys';
import { Agent } from '../services/agent/types';
import { updateAssignee, updatePriority } from '../services/conversation';
import {
  Conversation,
  ConversationMessagesResponse,
  ConversationMeta,
  ConversationPriority,
  Team,
  UpdateAssigneePayload,
  UpdateAssigneeTeamPayload,
  UpdatePriorityPayload,
} from '../services/conversation/types';
import { useListTeamsQuery } from '../services/team/repository';

type AssignmentSectionProps = {
  meta?: ConversationMeta;
  conversation?: Conversation;
  agents?: Option<Agent>[];
  teams?: Option<Team>[];
};

export function AssignmentSection({
  meta,
  conversation,
  agents,
}: AssignmentSectionProps): JSX.Element {
  const priorityBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const agentsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const teamsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const PRIORITY_OPTIONS: { label: string; value: ConversationPriority }[] = [
    { label: t('chat.assignment.priority_none'), value: 'none' },
    { label: t('chat.assignment.priority_low'), value: 'low' },
    { label: t('chat.assignment.priority_medium'), value: 'medium' },
    { label: t('chat.assignment.priority_high'), value: 'high' },
    { label: t('chat.assignment.priority_urgent'), value: 'urgent' },
  ];

  const { data: teams } = useListTeamsQuery({
    select: (data) => [
      {
        label: t('chat.assignment.priority_none'),
        value: String(0),
        data: {} as Team,
      },
      ...(data ?? []).map((team) => ({
        label: team.name,
        value: String(team.id),
        data: team,
      })),
    ],
  });

  const listMessagesQueryKey = conversationKeys.messages(
    user?.id ?? 0,
    conversation?.id?.toString() ?? '',
  );

  const conversationDetailsQueryKey = conversationKeys.details(
    user?.id ?? 0,
    conversation?.id?.toString() ?? '',
  );

  const updateAssigneeMutation = useMutation({
    mutationKey: conversationKeys.updateAssignee,
    mutationFn: (payload: UpdateAssigneePayload) =>
      updateAssignee(user?.id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: listMessagesQueryKey });

      const previousData = optimisticUpdateQuery<
        InfiniteData<ConversationMessagesResponse>
      >(listMessagesQueryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            meta: {
              ...page.meta,
              assignee: agents?.find(
                (agent) => agent.value === payload.assignee_id.toString(),
              )?.data as Agent,
            },
          })),
        };
      });

      return { previousData };
    },
  });

  const updateAssigneeTeamMutation = useMutation({
    mutationKey: conversationKeys.updateAssignee,
    mutationFn: (payload: UpdateAssigneeTeamPayload) =>
      updateAssignee(user?.id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload) => {
      const previousData = optimisticUpdateQuery<Conversation>(
        conversationDetailsQueryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            meta: {
              ...old.meta,
              team: teams?.find(
                (team) => team.value === payload.team_id.toString(),
              )?.data as Team,
            },
          };
        },
      );

      return { previousData };
    },
  });

  const updatePriorityMutation = useMutation({
    mutationKey: conversationKeys.updatePriority,
    mutationFn: (payload: UpdatePriorityPayload) =>
      updatePriority(user?.id ?? 0, conversation?.id ?? 0, payload),
    onMutate: async (payload) => {
      const previousData = optimisticUpdateQuery<Conversation>(
        conversationDetailsQueryKey,
        (old) => {
          if (!old) return old;

          return { ...old, priority: payload.priority };
        },
      );

      return { previousData };
    },
  });

  function onChangeAgent(agentId: string): void {
    updateAssigneeMutation.mutate({ assignee_id: Number(agentId) });
  }

  function onChangeTeam(teamId: string): void {
    updateAssigneeTeamMutation.mutate({ team_id: Number(teamId) });
  }

  function onChangePriority(priority: ConversationPriority): void {
    updatePriorityMutation.mutate({ priority: priority });
  }

  return (
    <>
      <Container.Card>
        <MenuItem.Action
          icon="user"
          label={t('chat.assignment.agent')}
          loading={updateAssigneeMutation.isPending}
          value={meta?.assignee?.name}
          onPress={() => agentsBottomSheetRef.current?.present()}
        />
        <Divider className="-mx-md" />
        <MenuItem.Action
          icon="userSettings"
          label={t('chat.assignment.assignee')}
          loading={updateAssigneeTeamMutation.isPending}
          value={conversation?.meta?.team?.name}
          onPress={() => teamsBottomSheetRef.current?.present()}
        />
        <Divider className="-mx-md" />
        <MenuItem.Action
          icon="signal"
          label={t('chat.assignment.priority')}
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

      <OptionBottomSheet
        ref={agentsBottomSheetRef}
        options={[
          {
            label: t('chat.assignment.priority_none'),
            value: String(0),
            data: {} as Agent,
          },
          ...(agents ?? []),
        ]}
        title={t('chat.assignment.agent')}
        onSelect={(opt) => onChangeAgent(opt.value)}
        selectedValue={agents?.find(
          (agent) => agent.value === (meta?.assignee?.id ?? 0).toString(),
        )}
      />

      <OptionBottomSheet
        ref={teamsBottomSheetRef}
        options={teams ?? []}
        title={t('chat.assignment.team')}
        onSelect={(opt) => onChangeTeam(opt.value)}
        selectedValue={teams?.find(
          (team) =>
            team.value === (conversation?.meta?.team?.id ?? 0).toString(),
        )}
      />

      <OptionBottomSheet
        ref={priorityBottomSheetRef}
        options={PRIORITY_OPTIONS}
        title={t('chat.assignment.priority')}
        onSelect={(opt) => onChangePriority(opt.value as ConversationPriority)}
        selectedValue={PRIORITY_OPTIONS.find(
          (opt) =>
            opt.value === (conversation?.priority ?? 'none').toLowerCase(),
        )}
      />
    </>
  );
}
