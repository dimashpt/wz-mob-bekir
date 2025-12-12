import React, { JSX } from 'react';
import { View } from 'react-native';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Divider, MenuItem, Text, ToggleSwitch } from '@/components';
import { useAppStore } from '@/store';

export function DeveloperFeaturesSection(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { showDevTools, toggleDevTools } = useAppStore();

  return (
    <View className="gap-md">
      <Text variant="headingXS">{t('profile.developer_features')}</Text>
      <View className="bg-surface px-lg py-md gap-md border-border rounded-md border">
        <MenuItem.Action
          icon="storybook"
          label={t('profile.storybook')}
          onPress={() => router.push('/storybook')}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="dev"
          label={t('profile.developer_tools')}
          rightElement={
            <ToggleSwitch
              value={showDevTools}
              onValueChange={toggleDevTools}
              size="small"
            />
          }
          onPress={() => toggleDevTools()}
        />
      </View>
    </View>
  );
}
