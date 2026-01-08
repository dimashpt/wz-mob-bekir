import React, { JSX, useRef, useState } from 'react';
import { View } from 'react-native';

import { InfiniteData, useMutation } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { IMessage, InputToolbarProps } from 'react-native-gifted-chat';
import { twMerge } from 'tailwind-merge';

import {
  Button,
  Clickable,
  Icon,
  IconNames,
  Image,
  ImagePreviewModal,
  InputField,
  Option,
  OptionBottomSheet,
  OptionBottomSheetRef,
  snackbar,
  Text,
} from '@/components';
import { useDebounce } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import { formatFileSize } from '@/utils/formatter';
import { resizeImage } from '@/utils/image';
import { MESSAGE_TYPES } from '../constants/flags';
import { conversationKeys } from '../constants/keys';
import { sendMessage, updateTypingStatus } from '../services/conversation';
import {
  ConversationMessagesResponse,
  Message,
  SendMessagePayload,
  UpdateTypingStatusPayload,
} from '../services/conversation/types';
import { generateEchoId } from '../utils/message';

type Params = {
  conversation_id: string;
};

const ATTACHMENT_OPTIONS = [
  {
    value: 'camera',
    label: 'Camera',
  },
  {
    value: 'image',
    label: 'Photo Library',
  },
  {
    value: 'fileAttachment',
    label: 'File Attachment',
  },
  {
    value: 'macro',
    label: 'Macro',
  },
];
export function ChatRoomInput(
  _props: InputToolbarProps<IMessage>,
): JSX.Element {
  const { chatUser } = useAuthStore();
  const { conversation_id } = useLocalSearchParams<Params>();
  const { t } = useTranslation();

  const [isPrivate, setIsPrivate] = useState(false);
  const optionBottomSheetRef = useRef<OptionBottomSheetRef>(null);
  const [attachment, setAttachment] = useState<
    ImagePicker.ImagePickerAsset | DocumentPicker.DocumentPickerAsset
  >();
  const imagePreviewRef = useRef<ImagePreviewModal>(null);
  const {
    value: message,
    setValue: setMessage,
    reset: resetMessage,
  } = useDebounce('', 5000, {
    onStartTyping: () => handleUpdateTypingStatus('on'),
    onEndTyping: () => handleUpdateTypingStatus('off'),
  });

  const toggleTypingMutation = useMutation({
    mutationKey: conversationKeys.updateTypingStatus,
    mutationFn: (payload: UpdateTypingStatusPayload) =>
      updateTypingStatus(chatUser!.account_id, conversation_id, payload),
  });

  const messageListKey = conversationKeys.messages(
    chatUser!.account_id,
    conversation_id,
  );

  const sendMessageMutation = useMutation({
    mutationKey: conversationKeys.sendMessage,
    mutationFn: async (payload: SendMessagePayload) => {
      if (attachment && isImage(attachment)) {
        const resizedUri = await resizeImage(attachment.uri, 256);

        payload.attachments = [
          {
            uri: resizedUri,
            type: attachment.mimeType,
            name: attachment.fileName ?? attachment.uri.split('/').pop(),
          },
        ];
      } else if (attachment && isFile(attachment)) {
        payload.attachments = [
          {
            uri: attachment.uri,
            type: attachment.mimeType,
            name: attachment.name ?? attachment.uri.split('/').pop(),
          },
        ];
      }

      return sendMessage(chatUser!.account_id, conversation_id, payload);
    },
    onMutate: async (newMessage, context) => {
      // Clear the message input
      resetMessage();

      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await context.client.cancelQueries({ queryKey: messageListKey });

      // Snapshot the previous value
      const previousMessages =
        context.client.getQueryData<ConversationMessagesResponse>(
          messageListKey,
        );

      const messagePayload = {
        attachments: attachment
          ? [
              {
                data_url: attachment?.uri ?? '',
                file_type: isImage(attachment!) ? 'image' : 'file',
                id: Date.now(),
              },
            ]
          : undefined,
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
        messageListKey,
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

      setAttachment(undefined);

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onSuccess: (data, payload, __, context) => {
      // Update the message status and data with the server response
      context.client.setQueryData(
        messageListKey,
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
        messageListKey,
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
    const trimmedMessage = message.trim();

    // Prevent sending empty or whitespace-only messages
    if (!trimmedMessage) {
      return;
    }

    const echoId = generateEchoId();

    sendMessageMutation.mutate({
      content: trimmedMessage,
      content_attributes: {},
      echo_id: echoId,
      private: isPrivate,
    });
  }

  async function onSelectAttachment(value: Option): Promise<void> {
    if (value.value === 'camera') {
      const result = await ImagePicker.requestCameraPermissionsAsync();

      if (!result.granted) {
        snackbar.error(t('chat.input.camera_permission_error'));
        return;
      }

      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      setAttachment(cameraResult?.assets?.[0]);

      return;
    }

    if (value.value === 'image') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      setAttachment(result.assets?.[0]);

      return;
    }

    if (value.value === 'fileAttachment') {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setAttachment(result.assets?.[0]);
      }

      return;
    }
  }

  function isImage(
    attachment:
      | ImagePicker.ImagePickerAsset
      | DocumentPicker.DocumentPickerAsset,
  ): attachment is ImagePicker.ImagePickerAsset {
    return (attachment as ImagePicker.ImagePickerAsset).type === 'image';
  }

  function isFile(
    attachment:
      | ImagePicker.ImagePickerAsset
      | DocumentPicker.DocumentPickerAsset,
  ): attachment is DocumentPicker.DocumentPickerAsset {
    return (attachment as DocumentPicker.DocumentPickerAsset).mimeType !== null;
  }

  function renderAttachment(): React.JSX.Element | null {
    // Render image attachment
    if (attachment && isImage(attachment)) {
      return (
        <Clickable
          onPress={() => imagePreviewRef.current?.open(attachment.uri)}
          className="self-start rounded-md"
        >
          <Image
            source={{ uri: attachment.uri }}
            className="aspect-square h-20 w-full rounded-md object-contain"
          />
          <Clickable
            onPress={() => setAttachment(undefined)}
            className="absolute top-1 right-1"
          >
            <Icon name="closeCircle" size="xl" className="text-muted" />
          </Clickable>
        </Clickable>
      );
    }

    // Render file attachment
    if (attachment && isFile(attachment)) {
      return (
        <Clickable
          onPress={() => {}}
          className="p-md border-border gap-sm flex-row items-center rounded-md border"
        >
          <Icon
            name="fileAttachment"
            size="2xl"
            className="text-muted-foreground"
          />
          <View className="shrink">
            <Text variant="labelS" numberOfLines={1} ellipsizeMode="middle">
              {attachment.name}
            </Text>
            <Text variant="bodyXS" color="muted">
              {formatFileSize(attachment.size ?? 0)}
            </Text>
          </View>
          <Clickable
            onPress={() => setAttachment(undefined)}
            className="absolute top-1 right-1"
          >
            <Icon name="closeCircle" size="xl" className="text-muted" />
          </Clickable>
        </Clickable>
      );
    }

    return null;
  }

  return (
    <View className="pb-safe bg-surface gap-sm">
      <View className="pt-sm px-lg gap-sm flex-row items-end">
        {!attachment && (
          <Button
            onPress={optionBottomSheetRef.current?.present}
            icon={
              <Icon name="plus" size="xl" className="text-muted-foreground" />
            }
            size="small"
            color="secondary"
          />
        )}
        <View className="gap-sm flex-1">
          {renderAttachment()}
          <InputField
            placeholder={
              isPrivate
                ? t('chat.input.placeholder_private')
                : t('chat.input.placeholder')
            }
            className="bg-background max-h-40"
            inputClassName="py-1.5"
            value={message}
            onChangeText={setMessage}
            onPressRight={() => setIsPrivate(!isPrivate)}
            right={
              <Icon
                name="lock"
                size="base"
                className={twMerge(
                  isPrivate ? 'text-accent' : 'text-muted-foreground',
                )}
              />
            }
            multiline
            // onSubmitEditing={handleSendMessage}
          />
        </View>
        <Button
          onPress={handleSendMessage}
          disabled={attachment ? false : !message.trim()}
          icon="send"
          size="small"
        />
      </View>
      <OptionBottomSheet
        ref={optionBottomSheetRef}
        options={ATTACHMENT_OPTIONS}
        onSelect={onSelectAttachment}
        renderItem={({ item, index }) => (
          <View
            className={twMerge(
              'px-md py-sm gap-sm w-full flex-row items-center',
              index === ATTACHMENT_OPTIONS.length - 1
                ? 'rounded-b-lg'
                : 'border-border border-b',
            )}
          >
            <Icon
              name={item.value as IconNames}
              size="2xl"
              className="text-muted-foreground"
            />
            <Text variant="bodyS">{item.label}</Text>
          </View>
        )}
      />
      <ImagePreviewModal ref={imagePreviewRef} />
    </View>
  );
}
