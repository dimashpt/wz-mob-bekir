import { ReactElement, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { nativeApplicationVersion } from 'expo-application';
import * as ExpoInAppUpdates from 'expo-in-app-updates';
import { useTranslation } from 'react-i18next';

import { BottomSheet, BottomSheetModal } from '../bottom-sheet';

/**
 * Compares two version strings and returns a number indicating their relationship.
 * @param v1 - The first version string to compare.
 * @param v2 - The second version string to compare.
 * @returns A number indicating the relationship between the two versions:
 *          -1 if update is available,
 *           0 if local version is equal to store version,
 *           1 if local version is newer than store version.
 */
export const compareVersions = (v1: string, v2: string): number => {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const a = v1Parts[i] || 0;
    const b = v2Parts[i] || 0;

    if (a > b) return 1;
    if (a < b) return -1;
  }

  return 0;
};

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
