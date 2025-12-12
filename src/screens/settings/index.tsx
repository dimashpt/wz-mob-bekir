import React, { ReactElement, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  BottomSheet,
  BottomSheetModal,
  Button,
  Container,
  Text,
} from '@/components';
import { snackbar } from '@/components/snackbar';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
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
    <Container className="pt-safe">
      <Container.Scroll
        className="bg-background"
        contentContainerClassName="p-lg gap-md"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
      >
        <Text variant="headingL">{t('settings.title')}</Text>
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
      </Container.Scroll>
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
