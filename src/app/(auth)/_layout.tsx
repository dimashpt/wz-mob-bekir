import { JSX } from 'react';

import { Stack } from 'expo-router';

export default function AuthLayout(): JSX.Element {
  // Show auth screens (login, signup, etc.)
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="login-chat" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
