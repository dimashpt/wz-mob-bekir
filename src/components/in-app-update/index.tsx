import { ReactElement, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { nativeApplicationVersion } from 'expo-application';
import * as ExpoInAppUpdates from 'expo-in-app-updates';
import { useTranslation } from 'react-i18next';

import { compareVersions } from '@/utils/validation';
import { BottomSheet, BottomSheetModal } from '../bottom-sheet';

export const InAppUpdateDialog = (): ReactElement => {
  const updateDialogRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const [newVersion, setNewVersion] = useState<string | null>(null);

  useEffect(() => {
    checkForUpdate();
  }, []);

  async function checkForUpdate(): Promise<void> {
    if (__DEV__ || Platform.OS === 'web') return;

    if (Platform.OS === 'android') {
      ExpoInAppUpdates.checkAndStartUpdate(true);
    } else {
      const { storeVersion } = await ExpoInAppUpdates.checkForUpdate();
      const localVersion = nativeApplicationVersion?.replace('v', '') ?? '';
      const updateStatus = compareVersions(localVersion, storeVersion);

      // ignore if store version is equal to local version or local version is newer than store version
      if ([0, 1].includes(updateStatus)) return;

      setNewVersion(storeVersion);

      updateDialogRef.current?.present();
    }
  }

  return (
    <BottomSheet.Confirm
      dismissable={false}
      ref={updateDialogRef}
      title={t('update.message')}
      showCloseButton
      handleSubmit={() => ExpoInAppUpdates.startUpdate()}
      closeButtonProps={{ text: t('update.later') }}
      submitButtonProps={{ text: t('update.button') }}
      description={t('update.description', { version: newVersion })}
    />
  );
};
