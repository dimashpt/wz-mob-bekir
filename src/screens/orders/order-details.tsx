import React, { JSX } from 'react';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

import { Container, Header, Text } from '@/components';

export default function OrderDetailsScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;

  return (
    <Container
      className="bg-background flex-1"
      style={{
        paddingBottom: insets.bottom || spacingLg,
      }}
    >
      <Header title={t('order_details.title')} />
      <Container.Scroll
        className="p-lg"
        contentContainerClassName="bg-surface p-md flex-1 items-center justify-center rounded-md"
      >
        <Text variant="labelM">{t('order_details.title')}</Text>
      </Container.Scroll>
    </Container>
  );
}
