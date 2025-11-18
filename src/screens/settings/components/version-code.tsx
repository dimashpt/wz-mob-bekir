import React, { JSX } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import z from 'zod';

import {
  BottomSheet,
  BottomSheetModal,
  InputField,
  snackbar,
  Text,
} from '@/components';
import { useAppStore } from '@/store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getBetaCodeSchema = (t: (key: string) => string) =>
  z.object({
    code: z.string().min(1, t('profile.beta_code.error.code_required')),
  });

type BetaCodeFormValues = z.infer<ReturnType<typeof getBetaCodeSchema>>;

export function VersionCode(): JSX.Element {
  const { t } = useTranslation();
  const betaFeaturesDialogRef = React.useRef<BottomSheetModal>(null);
  const { showBetaFeatures, toggleBetaFeatures } = useAppStore();

  const { control, handleSubmit, ...form } = useForm<BetaCodeFormValues>({
    resolver: zodResolver(getBetaCodeSchema(t)),
    defaultValues: { code: '' },
    mode: 'onChange',
  });

  function getUpdateVersion(): string {
    let updateVersion: string | undefined;

    if (
      typeof Constants.manifest2?.metadata === 'object' &&
      Constants.manifest2?.metadata &&
      'updateGroup' in Constants.manifest2.metadata
        ? (Constants.manifest2.metadata as Record<string, unknown>)[
            'updateGroup'
          ]
        : ''
    ) {
      updateVersion = (
        typeof Constants.manifest2?.metadata === 'object' &&
        Constants.manifest2?.metadata &&
        'updateGroup' in Constants.manifest2.metadata
          ? (Constants.manifest2.metadata as Record<string, unknown>)[
              'updateGroup'
            ]
          : ''
      )
        ?.toString()
        .split('-')?.[0];

      updateVersion = updateVersion?.substring(0, 3);
    } else {
      updateVersion = Updates.updateId?.split('-')?.[0];
    }

    return updateVersion ? ` #${updateVersion}` : '';
  }

  const gesture = Gesture.Tap()
    .numberOfTaps(__DEV__ ? 3 : 10)
    .maxDuration(250)
    .onEnd(runOnJS(onVersionTaps))
    .runOnJS(true);

  function onActivateBetaFeatures(data?: BetaCodeFormValues): void {
    if (showBetaFeatures) {
      toggleBetaFeatures();
      betaFeaturesDialogRef.current?.close();
      snackbar.success(t('profile.beta_code.message.deactivated'));

      return;
    }

    if (data?.code === process.env.EXPO_PUBLIC_BETA_CODE) {
      toggleBetaFeatures();
      snackbar.success(t('profile.beta_code.message.activated'));
    } else {
      snackbar.error(t('profile.beta_code.error.invalid'));
    }

    betaFeaturesDialogRef.current?.close();
  }

  function onVersionTaps(): void {
    betaFeaturesDialogRef.current?.present?.();
  }

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Text variant="bodyS" color="muted" className="text-center">
          {`v${nativeApplicationVersion} (${nativeBuildVersion}) ${getUpdateVersion()}`}
        </Text>
      </GestureDetector>
      <BottomSheet.Confirm
        ref={betaFeaturesDialogRef}
        title={
          showBetaFeatures
            ? t('profile.beta_code.message.title_deactivate')
            : t('profile.beta_code.message.title')
        }
        showCloseButton
        handleClose={form.reset}
        handleSubmit={
          showBetaFeatures
            ? onActivateBetaFeatures
            : handleSubmit(onActivateBetaFeatures)
        }
        variant={showBetaFeatures ? 'error' : 'info'}
        submitButtonProps={{ text: t('general.confirm') }}
        closeButtonProps={{ text: t('general.cancel') }}
      >
        {!showBetaFeatures ? (
          <Controller
            control={control}
            name="code"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                bottomSheet
                label={t('profile.beta_code.label')}
                placeholder={t('profile.beta_code.placeholder')}
                value={value}
                onChangeText={onChange}
                mandatory
                autoFocus
                error={!!error?.message}
                errors={[error?.message]}
                onBlur={onBlur}
                secureTextEntry
                enterKeyHint="done"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onActivateBetaFeatures)}
                secret
              />
            )}
          />
        ) : null}
      </BottomSheet.Confirm>
    </>
  );
}
