import React from 'react';
import { View } from 'react-native';

import dayjs from 'dayjs';

import { Clickable, Icon, Text } from '@/components';
import { ChatMessage } from '@/modules/@types/chat';
import { Attachment } from '../services/conversation/types';
import { MessageMarkdown } from './message-markdown';

export type MessageType = 'incoming' | 'outgoing' | 'private' | 'template';

interface MessageBubbleProps {
  message: ChatMessage;
  messageType: MessageType;
  replyMessage?: ChatMessage;
  attachments: Attachment[];
  hasAttachments: boolean;
  renderAttachment: (attachment: Attachment) => React.JSX.Element;
}

export function MessageBubble({
  message,
  messageType,
  replyMessage,
  attachments,
  hasAttachments,
  renderAttachment,
}: MessageBubbleProps): React.JSX.Element {
  const isOutgoing = messageType === 'outgoing';
  const isPrivate = messageType === 'private';
  const isTemplate = messageType === 'template';

  return (
    <>
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
      {hasAttachments ? (
        <View className="mb-xs gap-xs">
          {attachments.map((attachment) => renderAttachment(attachment))}
        </View>
      ) : null}
      {message.text ? (
        <MessageMarkdown
          text={message.text}
          isPrivate={isPrivate}
          isOutgoing={isOutgoing}
        />
      ) : null}
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
