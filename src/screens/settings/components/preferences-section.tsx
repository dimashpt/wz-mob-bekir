import React, { JSX, useRef } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import {
  BottomSheet,
  BottomSheetModal,
  Divider,
  MenuItem,
  OptionBottomSheet,
  OptionBottomSheetRef,
  snackbar,
  Text,
  ToggleSwitch,
} from '@/components';
import { LANGUAGES } from '@/constants/languages';
import { queryClient } from '@/lib/react-query';
import { ColorScheme, useAppStore } from '@/store';

const THEMES = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export function PreferencesSection(): JSX.Element {
  const languageBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const colorSchemeBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const clearCacheDialogRef = useRef<BottomSheetModal>(null);

  const { t } = useTranslation();
  const {
    setLanguage,
    language,
    theme,
    setTheme,
    pushNotificationsEnabled,
    setPushNotificationsEnabled,
  } = useAppStore();

  function onClearCache(): void {
    // Clear cache
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.invalidateQueries();

    // Show feedback
    clearCacheDialogRef.current?.close();
    snackbar.success(t('profile.message.pending_attendance_removed'));
  }

  return (
    <View className="gap-md">
      <Text variant="headingXS">{t('profile.preferences')}</Text>
      <View className="bg-surface px-lg py-md gap-md border-border rounded-md border">
        <MenuItem.Action
          icon="translate"
          label={t('profile.language')}
          value={
            LANGUAGES.find((lang) => lang.value === language)?.label ?? '-'
          }
          onPress={() => languageBottomSheetRef.current?.present()}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="appearance"
          label={t('profile.theme')}
          value={THEMES.find((_theme) => _theme.value === theme)?.label ?? '-'}
          onPress={() => colorSchemeBottomSheetRef.current?.present()}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="notification"
          label={t('profile.push_notifications')}
          rightElement={
            <ToggleSwitch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              size="small"
            />
          }
          onPress={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
        />
        <Divider className="-mx-lg" />
        <MenuItem.Action
          icon="cleanup"
          label={t('profile.clear_cache')}
          onPress={() => clearCacheDialogRef.current?.present()}
        />
      </View>
      <OptionBottomSheet
        ref={languageBottomSheetRef}
        options={LANGUAGES}
        title={t('profile.language')}
        onSelect={(opt) => setLanguage(opt?.value || 'en')}
        selectedValue={LANGUAGES.find((lang) => lang.value === language)}
      />
      <OptionBottomSheet
        ref={colorSchemeBottomSheetRef}
        options={THEMES}
        title={t('profile.theme')}
        onSelect={(opt) => setTheme(opt.value as ColorScheme)}
        selectedValue={THEMES.find((_theme) => _theme.value === theme)}
      />
      <BottomSheet.Confirm
        ref={clearCacheDialogRef}
        title={t('profile.clear_cache')}
        showCloseButton
        handleSubmit={onClearCache}
        submitButtonProps={{ text: t('general.yes') }}
        closeButtonProps={{ text: t('general.cancel') }}
        description={t('profile.description')}
      />
    </View>
  );
}
