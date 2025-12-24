import React, { JSX } from 'react';
import { View } from 'react-native';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Container, Divider, MenuItem, Text } from '@/components';
import { Meta } from '../services/conversation-room/types';
import { Conversation } from '../services/conversation/types';

type AttributesSectionProps = {
  meta?: Meta;
  conversation?: Conversation;
};

export function AttributesSection({
  meta,
  conversation,
}: AttributesSectionProps): JSX.Element {
  const { t } = useTranslation();
  const additionalAttributes = meta?.additional_attributes;
  const initiatedAt = additionalAttributes?.initiated_at?.timestamp;
  const browser = additionalAttributes?.browser;

  const browserName = browser?.browser_name
    ? `${browser?.browser_name} ${browser?.browser_version}`
    : '';
  const platformName = browser?.platform_name
    ? `${browser?.platform_name} ${browser?.platform_version}`
    : '';

  return (
    <View className="gap-sm">
      <Text variant="labelM">{t('chat.attributes.title')}</Text>
      <Container.Card>
        <MenuItem.Action
          label={t('chat.attributes.conversation_id')}
          value={conversation?.id?.toString()}
          rightElement={null}
        />
        <Divider className="-mx-md" />
        <MenuItem.Action
          label={t('chat.attributes.initiated_at')}
          value={dayjs(initiatedAt).format('DD/MM/YYYY HH:mm')}
          rightElement={null}
        />
        <Divider className="-mx-md" />
        <MenuItem.Action
          label={t('chat.attributes.browser')}
          value={browserName}
          rightElement={null}
        />
        <Divider className="-mx-md" />
        <MenuItem.Action
          label={t('chat.attributes.operating_system')}
          value={platformName}
          rightElement={null}
        />
        <Divider className="-mx-md" />
        <MenuItem.Action
          label={t('chat.attributes.ip_address')}
          value="127.0.0.1"
          rightElement={null}
        />
      </Container.Card>
    </View>
  );
}
