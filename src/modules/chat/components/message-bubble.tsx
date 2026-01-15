import React from 'react';
import { Linking, View } from 'react-native';

import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable, Icon, Image, Text } from '@/components';
import { ChatMessage } from '@/modules/@types/chat';
import { formatFileSize } from '@/utils/formatter';
import { MESSAGE_TYPES } from '../constants/flags';
import { Attachment } from '../services/conversation/types';
import { MessageMarkdown } from './message-markdown';

export type MessageType = 'incoming' | 'outgoing' | 'private' | 'template';

interface MessageBubbleProps {
  message: ChatMessage;
  replyMessage?: ChatMessage;
  attachments: Attachment[];
  onPreviewAttachment?: (attachment: Attachment) => void;
}

const messageBubbleTextVariants = tv({
  base: 'text-foreground',
  variants: {
    type: {
      incoming: 'text-foreground',
      outgoing: 'text-foreground-inverted',
      private: 'text-yellow-600',
      template: 'text-foreground',
    },
  },
});

export function MessageBubble({
  message,
  replyMessage,
  attachments,
  onPreviewAttachment,
}: MessageBubbleProps): React.JSX.Element {
  const isOutgoing = message.message_type === MESSAGE_TYPES.OUTGOING;
  const isPrivate = message.private;
  const isTemplate = message.message_type === MESSAGE_TYPES.TEMPLATE;
  const hasAttachments = attachments.length > 0;

  function getMessageType(): MessageType {
    if (isPrivate) return 'private';

    if (isTemplate) return 'template';

    if (isOutgoing) return 'outgoing';

    return 'incoming';
  }

  async function handleFilePress(fileUrl: string): Promise<void> {
    try {
      const canOpen = await Linking.canOpenURL(fileUrl);
      if (canOpen) {
        await Linking.openURL(fileUrl);
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      // Handle error silently or show snackbar if needed
    }
  }

  function renderAttachment(attachment: Attachment): React.JSX.Element {
    const messageType = getMessageType();
    const isImage = attachment.file_type === 'image';

    if (isImage) {
      const thumbnailUrl = attachment.thumb_url || attachment.data_url;
      const aspectRatio =
        attachment.width && attachment.height
          ? attachment.width / attachment.height
          : 1;

      return (
        <Clickable
          key={attachment.id}
          onPress={() => onPreviewAttachment?.(attachment)}
          className="mb-xs overflow-hidden rounded-md"
        >
          <Image
            source={{ uri: thumbnailUrl }}
            style={{ aspectRatio }}
            contentFit="cover"
            className="w-full rounded-md"
          />
        </Clickable>
      );
    }

    // File attachment
    const fileName = decodeURI(attachment?.data_url?.split('/')?.pop() ?? '');
    const fileSize = formatFileSize(attachment.file_size ?? 0);

    return (
      <Clickable
        key={attachment.id}
        onPress={() => handleFilePress(attachment.data_url)}
        className={twMerge(
          'mb-xs gap-sm bg-surface-soft p-sm flex-row items-center rounded-md border',
          isPrivate
            ? 'border-warning bg-warning/20'
            : 'border-border bg-surface/20',
        )}
      >
        <Icon
          name="fileAttachment"
          size="base"
          className={messageBubbleTextVariants({ type: messageType })}
        />
        <View className="shrink">
          <Text
            variant="bodyS"
            numberOfLines={1}
            ellipsizeMode="middle"
            className={messageBubbleTextVariants({ type: messageType })}
          >
            {fileName}
          </Text>
          <Text
            variant="labelXS"
            className={messageBubbleTextVariants({ type: messageType })}
            style={{ opacity: 0.7 }}
          >
            {fileSize}
          </Text>
        </View>
      </Clickable>
    );
  }

  return (
    <>
      {/* Render replied message */}
      {message?.content_attributes?.in_reply_to ? (
        <Clickable
          onPress={() => {}}
          className="gap-sm mb-xs py-xs px-sm flex-row items-center rounded-sm bg-white/20 dark:bg-black/20"
        >
          <Icon
            name="forward"
            size="sm"
            className="text-white/70 dark:text-black/70"
            transform="scale(-1,1)"
          />
          <View className="shrink">
            <Text
              variant="bodyXS"
              numberOfLines={3}
              className="text-white/70 dark:text-black/70"
            >
              {replyMessage?.sender?.name ?? '-'}
            </Text>
            <Text
              variant="bodyS"
              numberOfLines={3}
              className="text-white/90 dark:text-black/70"
            >
              {replyMessage?.text ?? '...'}
            </Text>
          </View>
        </Clickable>
      ) : null}

      {/* Render attachments */}
      {hasAttachments ? (
        <View className="mb-xs gap-xs">
          {attachments.map(renderAttachment)}
        </View>
      ) : null}

      {/* Render message content */}
      {message.text ? (
        <MessageMarkdown
          text={message.text}
          isPrivate={isPrivate}
          isOutgoing={isOutgoing}
        />
      ) : null}

      {/* Render message status */}
      <View className="gap-xs flex-row items-center justify-end">
        {isPrivate && (
          <Icon name="lock" size="sm" className="text-muted-foreground" />
        )}
        {isTemplate && (
          <Icon name="robot" size="sm" className="text-muted-foreground" />
        )}
        <Text variant="labelXS" color="muted">
          {dayjs(message.createdAt).format('HH:mm')}
        </Text>
        {isOutgoing && (
          <Icon
            name={message.pending ? 'clock' : 'tick'}
            size="base"
            className={
              message.status === 'read' ? 'text-info' : 'text-muted-foreground'
            }
          />
        )}
      </View>
    </>
  );
}
