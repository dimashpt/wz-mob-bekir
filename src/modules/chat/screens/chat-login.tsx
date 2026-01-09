import { JSX, useRef } from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import { z } from 'zod';

import { Container, Icon, InputField, snackbar, Text } from '@/components';
import { Button } from '@/components/button';
import { API } from '@/lib/axios';
import { authEndpoints } from '@/modules/auth/constants/endpoints';
import { loginChat } from '@/modules/auth/services';
import { useAuthStore } from '@/store';
import { emailSchema, stringSchema } from '@/utils/validation';

const chatLoginSchema = z.object({
  email: emailSchema,
  password: stringSchema,
});

type ChatLoginFormValues = z.infer<typeof chatLoginSchema>;

export default function ChatLoginScreen(): JSX.Element {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const spacingMd = useCSSVariable('--spacing-md') as number;
  const { setChatUser, setStatus, setChatHeaders } = useAuthStore();

  // Create refs for input fields
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Initialize React Hook Form with Zod resolver
  const { control, handleSubmit } = useForm<ChatLoginFormValues>({
    resolver: zodResolver(chatLoginSchema) as Resolver<ChatLoginFormValues>,
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Mutation
  const loginMutation = useMutation({
    mutationKey: [authEndpoints.chatLogin],
    mutationFn: loginChat,
    onSuccess: (data) => {
      // Check if MFA is required
      if (data.mfa_required) {
        // TODO: Navigate to MFA screen
        snackbar.error('MFA is required');
        return;
      }

      if (data.data) {
        API.defaults.headers.common['access-token'] =
          data.headers['access-token'];
        API.defaults.headers.common.client = data.headers.client;
        API.defaults.headers.common.uid = data.headers.uid;

        setStatus('loggedIn');
        setChatUser(data.data);
        setChatHeaders(data.headers);

        snackbar.success(t('login.message.success'));
      }
    },
  });

  function onSubmit(data: ChatLoginFormValues): void {
    Keyboard.dismiss();

    loginMutation.mutate(data);
  }

  return (
    <Container className="bg-surface pt-safe flex-1">
      <Container.Scroll
        className="p-lg flex-1"
        contentContainerClassName="items-center justify-end"
        style={{ paddingBottom: bottom || spacingMd }}
      >
        <View className="p-lg gap-lg w-full">
          <View className="gap-md items-start">
            <Icon name="chat" size={64} className="text-foreground" />
            <Text variant="headingL">Chat Login</Text>
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
                label={t('chat.login.email_label')}
                placeholder={t('chat.login.email_placeholder')}
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
                label={t('chat.login.password_label')}
                placeholder={t('chat.login.password_placeholder')}
                value={value}
                errors={error?.message}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                secret
              />
            )}
          />

          <Button
            text={t('chat.login.submit_button')}
            onPress={handleSubmit(onSubmit)}
            loading={loginMutation.isPending}
          />
        </View>
      </Container.Scroll>
    </Container>
  );
}
