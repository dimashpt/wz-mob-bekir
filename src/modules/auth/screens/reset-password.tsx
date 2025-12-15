import { JSX, useRef } from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import { z } from 'zod';

import { Container, Header, InputField, snackbar, Text } from '@/components';
import { Button } from '@/components/button';
import { resetPassword } from '@/modules/auth/services';
import { useAuthStore } from '@/store';
import { AUTH_ENDPOINTS } from '../constants/endpoints';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.email(),
      token: z.string(),
      password: z
        .string()
        .min(1, t('reset_password.error.password_required'))
        .min(8, t('reset_password.error.password_min_length')),
      password_confirmation: z
        .string()
        .min(1, t('reset_password.error.confirm_password_required')),
    })
    .refine((val) => val.password === val.password_confirmation, {
      message: t('reset_password.error.password_match'),
      path: ['password_confirmation'],
    });

type ForgotFormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;

type Params = {
  token: string;
  email: string;
};

export default function ForgotPasswordResetScreen(): JSX.Element {
  // Create refs for input fields
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);

  const { token, email } = useLocalSearchParams<Params>();
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { bottom } = useSafeAreaInsets();
  const spacingMd = useCSSVariable('--spacing-md') as number;

  const { control, handleSubmit, trigger, getValues } =
    useForm<ForgotFormValues>({
      resolver: zodResolver(getResetPasswordSchema(t)),
      mode: 'onChange',
      defaultValues: {
        email,
        token,
        password: '',
        password_confirmation: '',
      },
    });

  const resetPasswordMutation = useMutation({
    mutationKey: [AUTH_ENDPOINTS.RESET_PASSWORD],
    mutationFn: resetPassword,
    onSuccess: () => {
      snackbar.success(t('reset_password.message.success'));
    },
    onSettled: handleBack,
  });

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

  function onSubmit(values: ForgotFormValues): void {
    Keyboard.dismiss();

    // TODO: Mutation - Update password
    resetPasswordMutation.mutate(values);
  }

  function handleBack(): void {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/login');
    }
  }

  return (
    <Container variant="surface">
      <Header className="border-b-0" onPressBack={handleBack} />
      <Container.Scroll
        className="p-lg flex-1"
        contentContainerClassName="justify-end"
        style={{ paddingBottom: bottom || spacingMd }}
      >
        <View className="bg-surface p-lg gap-md w-full rounded-lg">
          <Text variant="headingL">{t('reset_password.heading')}</Text>
          <View className="gap-md w-full">
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
                  errors={error?.message}
                  onChangeText={(text) => {
                    onChange(text);

                    if (getValues('password_confirmation') !== '') {
                      trigger('password_confirmation');
                    }
                  }}
                  onBlur={onBlur}
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
              name="password_confirmation"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <InputField
                  ref={passwordConfirmRef}
                  label={t('reset_password.confirm_password')}
                  placeholder={t('reset_password.confirm_password')}
                  value={value}
                  errors={error?.message}
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
            loading={resetPasswordMutation.isPending}
          />
        </View>
      </Container.Scroll>
    </Container>
  );
}
