import React, { ReactElement, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomSheet,
  BottomSheetModal,
  Button,
  Container,
  Text,
} from '@/components';
import { snackbar } from '@/components/snackbar';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';
import { AuthService } from '@/services';
import { useAppStore, useAuthStore } from '@/store';
import { DeveloperFeaturesSection } from './components/developer-features-section';
import { PreferencesSection } from './components/preferences-section';
import { VersionCode } from './components/version-code';

function SettingsScreen(): ReactElement {
  const { t } = useTranslation();
  const logoutDialogRef = useRef<BottomSheetModal>(null);
  const { logout } = useAuthStore();
  const { showBetaFeatures } = useAppStore();
  const insets = useSafeAreaInsets();

  const logoutMutation = useMutation({
    mutationKey: [AUTH_ENDPOINTS.LOGOUT],
    mutationFn: AuthService.logout,
    onSuccess: () => snackbar.success(t('profile.message.logout_success')),
    onSettled: () => {
      logoutDialogRef.current?.close();
      logout();
    },
  });

  return (
    <Container
      className="bg-background p-lg flex-1"
      style={{
        paddingTop: insets.top + 20,
      }}
    >
      <Text variant="headingL" className="mb-lg">
        {t('settings.title')}
      </Text>
      <Animated.ScrollView
        contentContainerClassName="gap-lg"
        className="z-4 grow"
        scrollEventThrottle={16}
      >
        <PreferencesSection />
        {showBetaFeatures && <DeveloperFeaturesSection />}
        <Button
          prefixIcon="logout"
          size="small"
          variant="ghost"
          color="danger"
          text={t('profile.logout')}
          onPress={logoutDialogRef.current?.present}
          loading={logoutMutation.isPending}
        />
        <VersionCode />
      </Animated.ScrollView>
      <BottomSheet.Confirm
        ref={logoutDialogRef}
        title={t('profile.logout')}
        showCloseButton
        handleSubmit={logoutMutation.mutate}
        variant="error"
        submitButtonProps={{
          text: t('general.yes'),
          loading: logoutMutation.isPending,
        }}
        closeButtonProps={{ text: t('general.cancel') }}
        description={t('profile.logout_confirmation_description')}
      />
    </Container>
  );
}

export default SettingsScreen;
