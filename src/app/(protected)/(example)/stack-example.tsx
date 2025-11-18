import React, { JSX } from 'react';

import { useTranslation } from 'react-i18next';

import { Container, Text } from '@/components';

export default function StackExampleScreen(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Container className="bg-background items-center justify-center">
      <Text>{t('example.stack_example')}</Text>
    </Container>
  );
}
