import { JSX, useEffect, useRef } from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable, withUniwind } from 'uniwind';
import { z } from 'zod';

import { ErrorResponse } from '@/@types/api';
import { BottomSheet, Container, InputField, Text } from '@/components';
import { BottomSheetModal } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { snackbar } from '@/components/snackbar';
import { API } from '@/lib/axios';
import { forgotPassword, login } from '@/modules/auth/services';
import { useAuthStore } from '@/store';
import { handleMutationError } from '@/utils/error-handler';
import { authKeys } from '../constants/keys';

const Image = withUniwind(ExpoImage);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .email(t('login.form.error.email_invalid'))
      .min(1, t('login.form.error.email_required')),
    password: z
      .string()
      .min(1, t('login.form.error.password_required'))
      .min(6, t('login.form.error.password_min')),
  });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getForgotSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .email(t('forgot.form.error.email_invalid'))
      .min(1, t('forgot.form.error.email_required')),
  });

type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
type ForgotFormValues = z.infer<ReturnType<typeof getForgotSchema>>;

function LoginScreen(): JSX.Element {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { setToken, status, setUser } = useAuthStore();
  const { bottom } = useSafeAreaInsets();
  const spacingMd = useCSSVariable('--spacing-md') as number;

  // Create refs for input fields
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const forgotPasswordBottomSheetRef = useRef<BottomSheetModal>(null);

  // Initialize React Hook Form with Zod resolver
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Forgot password form
  const {
    control: forgotControl,
    handleSubmit: handleForgotSubmit,
    setError: setForgotError,
    reset: resetForgot,
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(getForgotSchema(t)),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationKey: authKeys.login,
    mutationFn: login,
    onSuccess: (data) => {
      API.defaults.headers.common['Authorization'] =
        `Bearer ${data.auth_token}`;
      API.defaults.headers.common['X-Tenant-Id'] = data.user.tenant_id;

      setToken(data!);
      setUser(data.user);

      navigate('/login-chat');
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        handleMutationError(null, {
          fallbackMessage:
            error.response?.data?.errors ||
            error.response?.data?.error ||
            error.response?.data?.message,
        });
      }
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationKey: authKeys.forgotPassword,
    mutationFn: forgotPassword,
    onSuccess: () => {
      Keyboard.dismiss();
      resetForgot({});
      forgotPasswordBottomSheetRef.current?.close();
      snackbar.success(t('forgot.message.success'));
    },
    onError: (error) => {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        const message =
          typeof error.response?.data?.errors === 'string'
            ? error.response?.data?.errors
            : t('general.error.something_went_wrong');

        setForgotError('email', { message });
      }
    },
  });

  function openForgotPasswordBottomSheet(): void {
    forgotPasswordBottomSheetRef.current?.present();
  }

  function onSubmit(data: LoginFormValues): void {
    Keyboard.dismiss();
    loginMutation.mutate(data);
  }

  function onForgotSubmit(data: ForgotFormValues): void {
    Keyboard.dismiss();
    forgotPasswordMutation.mutate({ email: data.email });
  }

  useEffect(() => {
    if (status === 'firstLogin') {
      navigate('/reset-password');
    }
  }, [status]);

  return (
    <Container className="bg-surface flex-1 pt-0">
      <Container.Scroll
        className="p-lg flex-1"
        contentContainerClassName="justify-end"
        style={{ paddingBottom: bottom || spacingMd }}
      >
        <View className="p-lg gap-lg w-full">
          <View className="gap-md items-start">
            <Image
              source={require('@/assets/images/icon.png')}
              className="size-20"
              contentFit="contain"
            />
            <Text variant="headingL">{t('login.title')}</Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                ref={emailRef}
                label={t('login.form.email')}
                placeholder={t('login.form.email_placeholder')}
                value={value}
                errors={error?.message}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            )}
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
                label={t('login.form.password')}
                placeholder={t('login.form.password_placeholder')}
                value={value}
                errors={error?.message}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                secret
                labelSuffix={
                  <Button
                    text={t('login.form.forgot')}
                    variant="ghost"
                    size="small"
                    color="primary"
                    onPress={openForgotPasswordBottomSheet}
                  />
                }
              />
            )}
          />

          <Button
            text={t('login.form.submit')}
            onPress={handleSubmit(onSubmit)}
            loading={loginMutation.isPending}
          />
        </View>
      </Container.Scroll>
      <BottomSheet.Confirm
        ref={forgotPasswordBottomSheetRef}
        variant="info"
        title={t('forgot.heading')}
        description={t('forgot.description')}
        handleSubmit={handleForgotSubmit(onForgotSubmit)}
        submitButtonProps={{
          text: t('forgot.form.submit'),
          loading: forgotPasswordMutation.isPending,
          disabled: forgotPasswordMutation.isPending,
        }}
      >
        <View className="w-full">
          <Controller
            control={forgotControl}
            name="email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                placeholder={t('login.form.email_placeholder')}
                value={value}
                errors={error?.message}
                onChangeText={onChange}
                onBlur={onBlur}
                bottomSheet
                autoCapitalize="none"
                keyboardType="email-address"
                onSubmitEditing={handleForgotSubmit(onForgotSubmit)}
                returnKeyType="done"
              />
            )}
          />
        </View>
      </BottomSheet.Confirm>
    </Container>
  );
}

export default LoginScreen;
