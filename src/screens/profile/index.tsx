import React, { ReactElement } from 'react';
import { RefreshControl } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Container, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useProfileQuery } from '@/services/user/repository';
import { useAppStore } from '@/store';
import { DeveloperFeaturesSection } from './components/developer-features-section';
import { PreferencesSection } from './components/preferences-section';
import { ProfileCard } from './components/profile-card';
import { VersionCode } from './components/version-code';

function ProfileScreen(): ReactElement {
  const { t } = useTranslation();
  const { showBetaFeatures } = useAppStore();
  const { data: profile, refetch, isRefetching } = useProfileQuery();

  async function handleRefresh(): Promise<void> {
    await refetch();
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
        <Text variant="headingL">{t('profile.title')}</Text>
        <ProfileCard profile={profile} />
        <PreferencesSection />
        {showBetaFeatures && <DeveloperFeaturesSection />}
        <VersionCode />
      </Container.Scroll>
    </Container>
  );
}

export default ProfileScreen;
