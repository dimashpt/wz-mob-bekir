import React, { JSX } from 'react';

import { useTranslation } from 'react-i18next';

import { Container, Text } from '@/components';

export default function OrdersScreen(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Container className="flex-1 items-center justify-center">
      <Text>{t('orders.title')}</Text>
    </Container>
  );
}
