import React, { JSX } from 'react';

import { Container, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';

export function FormStepSummary(): JSX.Element {
  return (
    <Container.Scroll
      contentContainerClassName="p-lg"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Container.Card className="p-lg flex-1 items-center justify-center">
        <Text className="text-lg">Order Summary</Text>
        <Text className="text-muted-foreground">
          Step 5 content will go here
        </Text>
      </Container.Card>
    </Container.Scroll>
  );
}
