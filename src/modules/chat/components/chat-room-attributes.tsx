import React, { JSX } from 'react';
import { View } from 'react-native';

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
import { useListParticipantsQuery } from '../services/conversation-room/repository';
import { Meta } from '../services/conversation-room/types';
import { Conversation } from '../services/conversation/types';

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
      snooze: 'bg-info-soft border-info',
      resolve: 'bg-success-soft border-success',
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
  const { data: participants } = useListParticipantsQuery(
    undefined,
    conversation?.id?.toString() ?? '',
  );

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
    value: 'open' | 'pending' | 'snooze' | 'resolve';
    icon: IconNames;
    active: boolean;
  }[] = [
    {
      label: 'Open',
      value: 'open',
      icon: 'refresh',
      active: true,
    },
    {
      label: 'Pending',
      value: 'pending',
      icon: 'clock',
      active: false,
    },
    {
      label: 'Snooze',
      value: 'snooze',
      icon: 'notification',
      active: false,
    },
    {
      label: 'Resolve',
      value: 'resolve',
      icon: 'tickCircle',
      active: false,
    },
  ];

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
            onPress={() => {}}
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
