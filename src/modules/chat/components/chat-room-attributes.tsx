import React, { JSX } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, Container } from '@/components';
import { useListAssignableAgentsQuery } from '../services/agent/repository';
import { Conversation, ConversationMeta } from '../services/conversation/types';
import { AssignmentSection } from './assignment-section';
import { AttributesSection } from './attributes-section';
import { LabelsSection } from './labels-section';
import { ParticipantsSection } from './participants-section';
import { StatusSection } from './status-section';

type ChatRoomAttributesProps = {
  meta?: ConversationMeta;
  conversation?: Conversation;
};

export function ChatRoomAttributes({
  meta,
  conversation,
}: ChatRoomAttributesProps): JSX.Element {
  const { t } = useTranslation();
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

  return (
    <Container.Scroll contentContainerClassName="p-lg gap-md">
      <StatusSection conversation={conversation} />

      <AssignmentSection
        meta={meta}
        conversation={conversation}
        agents={agents}
      />

      <LabelsSection meta={meta} conversation={conversation} />

      <ParticipantsSection conversation={conversation} agents={agents} />

      <AttributesSection meta={meta} conversation={conversation} />

      <Button
        text={t('chat.actions.share_conversation')}
        onPress={() => {}}
        color="primary"
        variant="outlined"
      />
    </Container.Scroll>
  );
}
