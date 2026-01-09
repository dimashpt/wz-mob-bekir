import React, { ReactElement, useRef } from 'react';
import { RefreshControl, View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import {
  Avatar,
  BottomSheet,
  BottomSheetModal,
  Button,
  Chip,
  Container,
  snackbar,
  Text,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { authKeys } from '@/modules/auth/constants/keys';
import { logout } from '@/modules/auth/services';
import {
  useChatProfileQuery,
  useProfileQuery,
} from '@/modules/profile/services/repository';
import { useAppStore, useAuthStore } from '@/store';
import { DeveloperFeaturesSection } from '../components/developer-features-section';
import { PreferencesSection } from '../components/preferences-section';
import { VersionCode } from '../components/version-code';

function ProfileScreen(): ReactElement {
  const logoutDialogRef = useRef<BottomSheetModal>(null);

  const { t } = useTranslation();
  const { showBetaFeatures } = useAppStore();
  const { chatUser } = useAuthStore();
  const { logout: logoutUser, user: _user } = useAuthStore();

  const { data: profile, refetch, isRefetching } = useProfileQuery();
  const {
    data: chatProfile,
    isLoading: isChatProfileLoading,
    refetch: refetchChatProfile,
  } = useChatProfileQuery({
    select: (data) => ({
      ...data,
      account: data.accounts?.find(
        (account) => account.id === chatUser?.account_id,
      ),
    }),
  });
  const logoutMutation = useMutation({
    mutationKey: authKeys.logout,
    mutationFn: logout,
    onSuccess: () => snackbar.success(t('profile.message.logout_success')),
    onSettled: () => {
      logoutDialogRef.current?.close();
      logoutUser();
    },
  });

  function handleRefresh(): void {
    refetch();
    refetchChatProfile();
  }

  return (
    <Container className="pt-safe">
      <Container.Scroll
        className="bg-background"
        contentContainerClassName="p-lg gap-md"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        <View className="flex-row items-center justify-between">
          <Text variant="headingL">{t('profile.title')}</Text>
          <Button
            icon="logout"
            size="small"
            variant="ghost"
            color="danger"
            onPress={() => logoutDialogRef.current?.present()}
            loading={logoutMutation.isPending}
          />
        </View>
        <View className="gap-sm items-center justify-center">
          <View>
            <Avatar
              name={chatProfile?.name ?? ''}
              className="bg-surface size-20"
              textClassName="text-lg"
            />
            <View
              className={twMerge(
                'absolute right-0 bottom-0 size-4 rounded-full',
                chatProfile?.account?.availability_status === 'online'
                  ? 'bg-success'
                  : chatProfile?.account?.availability_status === 'busy'
                    ? 'bg-warning'
                    : 'bg-muted-foreground',
              )}
            />
          </View>
          <View className="gap-xs">
            <Text
              variant="labelL"
              loading={isChatProfileLoading}
              className="text-center"
            >
              {profile?.user?.name} / {chatProfile?.name}
            </Text>
            <Text
              variant="bodyS"
              color="muted"
              loading={isChatProfileLoading}
              className="text-center"
            >
              {profile?.user?.email} / {chatProfile?.email}
            </Text>
            {profile?.user && (
              <Chip
                label={`${profile?.user?.role_name} - ${profile?.tenant?.name}`}
                variant="gray"
                className="self-center"
                textProps={{
                  className: 'text-xs',
                }}
              />
            )}
          </View>
        </View>
        <PreferencesSection />
        {showBetaFeatures && <DeveloperFeaturesSection />}
        <VersionCode />
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
      </Container.Scroll>
    </Container>
  );
}

export default ProfileScreen;
