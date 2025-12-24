import React, { JSX, useState } from 'react';
import { View } from 'react-native';

import { InfiniteData, useMutation } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { IMessage, InputToolbarProps } from 'react-native-gifted-chat';

import { Button, Icon, InputField } from '@/components';
import { useDebounce } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import { CONVERSATIONS_ENDPOINTS } from '../constants/endpoints';
import { MESSAGE_TYPES } from '../constants/flags';
import { sendMessage, updateTypingStatus } from '../services/conversation-room';
import {
  ConversationMessagesResponse,
  Message,
  SendMessagePayload,
  UpdateTypingStatusPayload,
} from '../services/conversation-room/types';
import { generateEchoId } from '../utils/message';

type Params = {
  conversation_id: string;
};

export function ChatRoomInput(
  _props: InputToolbarProps<IMessage>,
): JSX.Element {
  const { chatUser } = useAuthStore();
  const { conversation_id } = useLocalSearchParams<Params>();
  const { t } = useTranslation();

  const [isPrivate, setIsPrivate] = useState(false);

  const [message, setMessage] = useDebounce('', 5000, {
    onStartTyping: () => handleUpdateTypingStatus('on'),
    onEndTyping: () => handleUpdateTypingStatus('off'),
  });

  const toggleTypingMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_TYPING_STATUS(
        chatUser!.account_id,
        conversation_id,
      ),
    ],
    mutationFn: (payload: UpdateTypingStatusPayload) =>
      updateTypingStatus(chatUser!.account_id, conversation_id, payload),
  });

  const queryKey = [
    CONVERSATIONS_ENDPOINTS.MESSAGES(
      chatUser?.account_id ?? 0,
      conversation_id,
    ),
    'infinite',
  ];
  const sendMessageMutation = useMutation({
    mutationKey: [
      CONVERSATIONS_ENDPOINTS.SEND_MESSAGE(
        chatUser!.account_id,
        conversation_id,
      ),
    ],
    mutationFn: (payload: SendMessagePayload) =>
      sendMessage(chatUser!.account_id, conversation_id, payload),
    onMutate: async (newMessage, context) => {
      // Clear the message input
      setMessage('');

      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await context.client.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousMessages =
        context.client.getQueryData<ConversationMessagesResponse>(queryKey);

      const messagePayload = {
        content: newMessage.content,
        private: newMessage.private,
        content_attributes: newMessage.content_attributes,
        created_at: new Date().getTime() / 1000,
        id: new Date().getTime(),
        message_type: MESSAGE_TYPES.OUTGOING,
        status: 'sending',
        echo_id: newMessage.echo_id,
        sender: {
          id: chatUser?.account_id ?? 0,
          name: chatUser?.name ?? '',
        },
      } as Message;

      // Optimistically update to the new value
      context.client.setQueryData(
        queryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          return {
            ...old,
            pages: old.pages.map((page, index) => ({
              ...page,
              // Append the message to the first page
              payload:
                index === 0 ? [...page.payload, messagePayload] : page.payload,
            })),
          };
        },
      );

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onSuccess: (data, payload, __, context) => {
      // Update the message status and data with the server response
      context.client.setQueryData(
        queryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              payload: page.payload.map((message) =>
                message.echo_id === payload.echo_id ? data : message,
              ),
            })),
          };
        },
      );
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(
        queryKey,
        onMutateResult?.previousMessages ?? {},
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  function handleUpdateTypingStatus(
    status: UpdateTypingStatusPayload['typing_status'],
  ): void {
    toggleTypingMutation.mutate({
      is_private: isPrivate,
      typing_status: status,
    });
  }

  function handleSendMessage(): void {
    const echoId = generateEchoId();

    sendMessageMutation.mutate({
      content: message.trim(),
      content_attributes: {},
      echo_id: echoId,
      private: isPrivate,
    });
  }

  return (
    <View className="pb-safe pt-sm bg-surface px-lg gap-sm flex-row items-center">
      <Button
        onPress={() => {}}
        icon={<Icon name="plus" size="xl" className="text-muted-foreground" />}
        size="small"
        color="secondary"
      />
      <View className="flex-1">
        <InputField
          placeholder={
            isPrivate
              ? t('chat.input.placeholder_private')
              : t('chat.input.placeholder')
          }
          className="bg-background"
          inputClassName="py-sm"
          value={message}
          onChangeText={setMessage}
          onPressRight={() => setIsPrivate(!isPrivate)}
          right={
            <Icon
              name="lock"
              size="base"
              className={isPrivate ? 'text-accent' : 'text-muted-foreground'}
            />
          }
          onSubmitEditing={handleSendMessage}
        />
      </View>
      <Button
        onPress={handleSendMessage}
        disabled={!message}
        icon="send"
        size="small"
      />
    </View>
  );
}
