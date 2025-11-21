import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, Text } from '@/components';

export default function ChatScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Container
      className="bg-background p-lg flex-1"
      style={{
        paddingTop: insets.top + 20,
      }}
    >
      <Text variant="headingL" className="mb-lg">
        {t('chat.title')}
      </Text>
      <View className="bg-surface p-md flex-1 items-center justify-center rounded-md">
        <Text variant="labelM">{t('chat.title')}</Text>
      </View>
    </Container>
  );
}
