import React, { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { Container, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { useAppStore } from '@/store';
import { DeveloperFeaturesSection } from './components/developer-features-section';
import { PreferencesSection } from './components/preferences-section';
import { ProfileCard } from './components/profile-card';
import { VersionCode } from './components/version-code';

function SettingsScreen(): ReactElement {
  const { t } = useTranslation();
  const { showBetaFeatures } = useAppStore();

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
        <ProfileCard />
        <PreferencesSection />
        {showBetaFeatures && <DeveloperFeaturesSection />}
        <VersionCode />
      </Container.Scroll>
    </Container>
  );
}

export default SettingsScreen;
