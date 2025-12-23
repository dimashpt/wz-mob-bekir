import React, { JSX, useRef } from 'react';
import { FlatList, View } from 'react-native';

import { useMutation } from '@tanstack/react-query';

import {
  Container,
  Divider,
  MenuItem,
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
  Text,
} from '@/components';
import { useAuthStore } from '@/store/auth-store';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import { updateParticipants } from '../services/conversation';
import { useListParticipantsQuery } from '../services/conversation-room/repository';
import {
  Agent,
  ConversationParticipantsResponse,
} from '../services/conversation-room/types';
import {
  Conversation,
  UpdateParticipantsPayload,
} from '../services/conversation/types';

type ParticipantsSectionProps = {
  conversation?: Conversation;
  agents?: Option<Agent>[];
};

export function ParticipantsSection({
  conversation,
  agents,
}: ParticipantsSectionProps): JSX.Element {
  const participantsBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const { chatUser } = useAuthStore();

  const { data: participants, refetch: refetchParticipants } =
    useListParticipantsQuery(undefined, conversation?.id?.toString() ?? '');

  const listParticipantsQueryKey = [
    CONVERSATIONS_ENDPOINTS.PARTICIPANTS(
      chatUser?.account_id ?? 0,
      conversation?.id?.toString() ?? '',
    ),
  ];

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
    onSuccess: () => refetchParticipants(),
  });

  function onChangeParticipants(participants: Option<Agent>[]): void {
    updateParticipantsMutation.mutate({
      user_ids: participants.map((participant) => Number(participant.value)),
    });
  }

  return (
    <>
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
    </>
  );
}
