import React, { JSX } from 'react';
import { BackHandler } from 'react-native';

import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Container, Text } from '@/components';
import { useNotification } from '@/hooks';

export default function HomeScreen(): JSX.Element {
  const { t } = useTranslation();

  // Setup notification
  useNotification();

  /**
   * Handle back press to exit app, if not handled, the expo router will throw error:
   * `The action 'GO_BACK' was not handled by any navigator.`
   */
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  // TODO: Set user info for Sentry

  function handleBackPress(): boolean {
    BackHandler.exitApp();

    return true;
  }

  return (
    <Container className="flex-1 items-center justify-center">
      <Text>{t('home.title')}</Text>
    </Container>
  );
}
