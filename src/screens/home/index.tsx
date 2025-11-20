import React, { JSX } from 'react';
import { BackHandler, View } from 'react-native';

import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, Text } from '@/components';
import { useNotification } from '@/hooks';

export default function HomeScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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
    <Container
      className="bg-background p-lg flex-1"
      style={{
        paddingTop: insets.top + 20,
      }}
    >
      <Text variant="headingL" className="mb-lg">
        {t('home.title')}
      </Text>
      <View className="bg-surface p-md flex-1 items-center justify-center rounded-md">
        <Text variant="labelM">{t('home.title')}</Text>
      </View>
    </Container>
  );
}
