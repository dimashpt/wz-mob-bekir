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
import { authEndpoints } from '@/modules/auth/constants/endpoints';
import { logout } from '@/modules/auth/services';
import { ProfileResponse } from '@/modules/profile/services/types';
import { useAuthStore } from '@/store';

interface ProfileCardProps {
  profile?: ProfileResponse;
}

export function ProfileCard({ profile }: ProfileCardProps): JSX.Element | null {
  const { t } = useTranslation();
  const logoutDialogRef = useRef<BottomSheetModal>(null);
  const { logout: logoutUser, user: _user } = useAuthStore();

  const user = profile?.user ?? _user;

  const logoutMutation = useMutation({
    mutationKey: [authEndpoints.logout],
    mutationFn: logout,
    onSuccess: () => snackbar.success(t('profile.message.logout_success')),
    onSettled: () => {
      logoutDialogRef.current?.close();
      logoutUser();
    },
  });

  return (
    <Container.Card className="gap-md">
      <View className="gap-md flex-row items-center">
        <ProfilePicture
          profilePictureUri={user?.avatar ?? undefined}
          photoClassName="h-16 w-16 rounded-full"
          placeholderSize={64}
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
