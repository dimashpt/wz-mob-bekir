import { JSX } from 'react';

import { Stack } from 'expo-router';

const SCREEN_NAMES = ['(example)/stack-example', 'storybook'];

export default function GuardLayout(): JSX.Element {
  return (
    <Stack>
      {SCREEN_NAMES.map((screenName) => (
        <Stack.Screen
          key={screenName}
          name={screenName}
          options={{ headerShown: false }}
        />
      ))}
    </Stack>
  );
}
