import React, { JSX } from 'react';

import { Container, Text } from '@/components';

export function FormStepItem(): JSX.Element {
  return (
    <Container.Scroll contentContainerClassName="p-lg">
      <Container.Card className="p-lg flex-1 items-center justify-center">
        <Text className="text-lg">Review & Submit</Text>
        <Text className="text-muted-foreground">
          Step 3 content will go here
        </Text>
      </Container.Card>
    </Container.Scroll>
  );
}
