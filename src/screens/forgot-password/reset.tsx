import { JSX, useRef, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect, useNavigation } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import { z } from 'zod';

import { Illustrations } from '@/assets/illustrations';
import {
  Container,
  Header,
  InputField,
  PasswordComplexity,
  Text,
} from '@/components';
import { Button } from '@/components/button';
import { EMOJI_REGEX } from '@/constants/regex';
import { useAuthStore } from '@/store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z
        .string()
        .min(1, t('reset_password.error.password_required'))
        .refine((val) => !/\s/.test(val), {
          message: t('reset_password.error.no_spaces'),
        })
        .refine((val) => !EMOJI_REGEX.test(val), {
          message: t('reset_password.error.no_emoji'),
        })
        .refine((val) => /[A-Z]/.test(val), {
          message: t('password_complexity.uppercase'),
        })
        .refine((val) => /[a-z]/.test(val), {
          message: t('password_complexity.lowercase'),
        })
        .refine((val) => /[0-9]/.test(val), {
          message: t('password_complexity.number'),
        })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: t('password_complexity.special'),
        })
        .min(8, t('reset_password.error.password_min_length')),
      confirm_password: z
        .string()
        .min(1, t('reset_password.error.confirm_password_required')),
    })
    .refine((val) => val.password === val.confirm_password, {
      message: t('reset_password.error.password_match'),
      path: ['confirm_password'],
    });

type ForgotFormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;

export default function ForgotPasswordResetScreen(): JSX.Element {
  // Create refs for input fields
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const spacingMd = useCSSVariable('--spacing-md') as number;

  const { control, handleSubmit, trigger, getValues } =
    useForm<ForgotFormValues>({
      resolver: zodResolver(getResetPasswordSchema(t)),
      mode: 'onChange',
      defaultValues: {
        password: '',
        confirm_password: '',
      },
    });

  /**
   * This useWatch is used to monitor the password field because the watch from
   * useForm causes unnecessary re-renders of the entire form, and not watching the
   * password field due to optimization by react compiler.
   */
  const password = useWatch({ control, name: 'password' });

  /**
   * Listen to back navigation to logout user, the purpose is to
   * handle gesture back navigation
   */
  useFocusEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (['GO_BACK', 'POP'].includes(e.data.action.type)) {
        logout();
      }
    });

    return unsubscribe;
  });

  function onSubmit({ password: _password }: ForgotFormValues): void {
    Keyboard.dismiss();

    // TODO: Mutation - Update password
  }

  return (
    <Container variant="surface">
      <Header title={t('reset_password.title')} />
      <Container.Scroll
        className="p-lg flex-1"
        contentContainerClassName="grow-0"
        contentContainerStyle={{ paddingBottom: bottom || spacingMd }}
      >
        <View className="bg-surface p-lg gap-md w-full items-center rounded-lg">
          <Illustrations.ResetPassword height={200} width={200} />
          <Text variant="headingL" className="text-center">
            {t('reset_password.heading')}
          </Text>
          <Text variant="bodyM" className="text-center">
            {t('reset_password.description')}
          </Text>
          <View className="gap-md w-full">
            <PasswordComplexity
              password={password}
              visible={isPasswordFieldFocused}
            />
            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <InputField
                  ref={passwordRef}
                  label={t('reset_password.password')}
                  placeholder={t('reset_password.password')}
                  value={value}
                  error={!!error?.message}
                  errors={[error?.message]}
                  onChangeText={(text) => {
                    onChange(text);

                    if (getValues('confirm_password') !== '') {
                      trigger('confirm_password');
                    }
                  }}
                  onBlur={() => {
                    onBlur();
                    setIsPasswordFieldFocused(false);
                  }}
                  onFocus={() => setIsPasswordFieldFocused(true)}
                  autoCapitalize="none"
                  textContentType="password"
                  returnKeyType="next"
                  keyboardType="ascii-capable"
                  secret
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordConfirmRef.current?.focus()}
                />
              )}
            />
            <Controller
              control={control}
              name="confirm_password"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <InputField
                  ref={passwordConfirmRef}
                  label={t('reset_password.confirm_password')}
                  placeholder={t('reset_password.confirm_password')}
                  value={value}
                  error={!!error?.message}
                  errors={[error?.message]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  textContentType="password"
                  returnKeyType="done"
                  keyboardType="ascii-capable"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  secret
                />
              )}
            />
          </View>
          <Button
            text={t('reset_password.form.submit')}
            onPress={handleSubmit(onSubmit)}
            className="w-full"
            // TODO: Loading - Update password
            loading={false}
          />
        </View>
      </Container.Scroll>
    </Container>
  );
}
