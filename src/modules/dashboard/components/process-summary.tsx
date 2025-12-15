import React, { JSX } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Container, Text } from '@/components';
import { formatNumber } from '@/utils/formatter';

interface ProcessSummaryProps {
  summaryProcessSummary?: {
    problem_process?: number;
    request_cancel?: number;
    delivery_issue?: number;
  };
}

export function ProcessSummary({
  summaryProcessSummary,
}: ProcessSummaryProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <View className="gap-md flex-row">
      <Container.Card className="flex-1" index={4}>
        <Text variant="labelXS" numberOfLines={1}>
          {t('home.problem_processed')}
        </Text>
        <Text variant="headingS">
          {formatNumber(summaryProcessSummary?.problem_process ?? 0)}
        </Text>
      </Container.Card>
      <Container.Card className="flex-1" index={5}>
        <Text variant="labelXS" numberOfLines={1}>
          {t('home.cancel_request')}
        </Text>
        <Text variant="headingS">
          {formatNumber(summaryProcessSummary?.request_cancel ?? 0)}
        </Text>
      </Container.Card>
      <Container.Card className="flex-1" index={6}>
        <Text variant="labelXS" numberOfLines={1}>
          {t('home.delivery_issue')}
        </Text>
        <Text variant="headingS">
          {formatNumber(summaryProcessSummary?.delivery_issue ?? 0)}
        </Text>
      </Container.Card>
    </View>
  );
}
