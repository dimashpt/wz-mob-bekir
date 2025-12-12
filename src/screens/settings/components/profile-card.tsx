import React, { JSX, useRef } from 'react';
import { View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  BottomSheet,
  BottomSheetModal,
  Button,
  Container,
  ProfilePicture,
  Text,
} from '@/components';
import { snackbar } from '@/components/snackbar';
import { AUTH_ENDPOINTS } from '@/constants/endpoints';
import { AuthService } from '@/services';
import { useProfileQuery } from '@/services/user/repository';
import { useAuthStore } from '@/store';

export function ProfileCard(): JSX.Element | null {
  const { t } = useTranslation();
  const logoutDialogRef = useRef<BottomSheetModal>(null);
  const { logout, user: _user } = useAuthStore();

  const { data: profile } = useProfileQuery();

  const user = profile?.user ?? _user;

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
    <Container.Card className="gap-md">
      <View className="gap-md flex-row items-center">
        <ProfilePicture
          profilePictureUri={user?.avatar ?? undefined}
          photoClassName="h-16 w-16 rounded-full"
        />
        <View className="gap-xs flex-1">
          <Text variant="headingS">{user?.name}</Text>
          {user?.email && (
            <Text variant="bodyS" color="muted">
              {user?.email}
            </Text>
          )}
          {user?.role_name && (
            <Text variant="bodyXS" color="muted">
              {user?.role_name}
            </Text>
          )}
        </View>
        <Button
          prefixIcon="logout"
          size="small"
          variant="ghost"
          color="danger"
          onPress={() => logoutDialogRef.current?.present()}
          loading={logoutMutation.isPending}
        />
      </View>
      {profile?.tenant && (
        <View className="pt-sm border-border gap-xs border-t">
          <Text variant="bodyXS" color="muted">
            Tenant
          </Text>
          <Text variant="bodyS">{profile?.tenant.name}</Text>
        </View>
      )}
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
    </Container.Card>
  );
}
