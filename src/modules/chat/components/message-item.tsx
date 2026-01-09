import type { ImagePreviewModal as ImagePreviewModalType } from '@/components/image-preview-modal';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { InfiniteData } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  BubbleProps,
  DayProps,
  IMessage,
  SystemMessageProps,
} from 'react-native-gifted-chat';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { useCSSVariable } from 'uniwind';

import { Clickable, Icon, Image, ImagePreviewModal, Text } from '@/components';
import { snackbar } from '@/components/snackbar';
import { queryClient } from '@/lib/react-query';
import { useAuthStore } from '@/store/auth-store';
import { formatFileSize } from '@/utils/formatter';
import { conversationEndpoints } from '../constants/endpoints';
import { MESSAGE_TYPES } from '../constants/flags';
import {
  Attachment,
  ConversationMessagesResponse,
  Message,
} from '../services/conversation/types';
import { mapInfiniteMessagesToGiftedChatMessages } from '../utils/message';

const MENU_WIDTH = 150;

interface MessageItemProps extends BubbleProps<ChatMessage> {
  onDelete: (messageId: number) => void;
}
const messageBubbleVariants = tv({
  base: 'p-sm bg-surface self-start',
  variants: {
    type: {
      incoming: 'bg-surface self-start',
      outgoing: 'bg-accent self-end',
      private: 'bg-warning-soft self-end border border-warning',
      template: 'bg-info-soft self-start',
    },
    groupWithPrevious: {
      true: 'rounded-tl-sm rounded-tr-sm',
      false: 'rounded-tl-lg rounded-tr-lg',
    },
    groupWithNext: {
      true: 'rounded-bl-sm rounded-br-sm',
      false: 'rounded-bl-lg rounded-br-lg',
    },
  },
  defaultVariants: {
    type: 'incoming',
    groupWithPrevious: false,
    groupWithNext: false,
  },
});

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

export type ChatMessage = IMessage & Message;
type MessageType = 'incoming' | 'outgoing' | 'private' | 'template';

interface MessageBubbleContentProps {
  message: ChatMessage;
  messageType: MessageType;
  replyMessage?: string;
  attachments: Attachment[];
  isReplyMessage: boolean | number | undefined;
  hasAttachments: boolean;
  renderAttachment: (attachment: Attachment) => React.JSX.Element;
}

function MessageBubbleContent({
  message,
  messageType,
  replyMessage,
  attachments,
  isReplyMessage,
  hasAttachments,
  renderAttachment,
}: MessageBubbleContentProps): React.JSX.Element {
  const isOutgoing = messageType === 'outgoing';
  const isPrivate = messageType === 'private';
  const isTemplate = messageType === 'template';

  return (
    <>
      {isReplyMessage && replyMessage ? (
        <Clickable
          onPress={() => {}}
          className="gap-sm mb-xs p-xs flex-row items-center rounded-sm bg-white/20 dark:bg-black/20"
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
              {replyMessage}
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
        <TextMarkdown
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

export function MessageItem({
  currentMessage: message,
  onDelete,
}: MessageItemProps): React.JSX.Element {
  const { chatUser } = useAuthStore();
  const imagePreviewRef = useRef<ImagePreviewModalType>(null);
  const messageLayoutRef = useRef<View>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [messagePosition, setMessagePosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const isOutgoing = message.message_type === MESSAGE_TYPES.OUTGOING;
  const isPrivate = message.private;
  const isTemplate = message.message_type === MESSAGE_TYPES.TEMPLATE;
  const isReplyMessage = message.content_attributes.in_reply_to;
  const attachments = message.attachments ?? [];
  const hasAttachments = attachments.length > 0;

  const queryKey = [
    conversationEndpoints.messages(
      chatUser?.account_id ?? 0,
      (message.conversation_id ?? '').toString(),
    ),
    'infinite',
  ];
  const messages =
    queryClient.getQueryData<InfiniteData<ConversationMessagesResponse>>(
      queryKey,
    );
  const replyMessage = useMemo(() => {
    const replyMessageId = message.content_attributes.in_reply_to;
    const mappedMessages = mapInfiniteMessagesToGiftedChatMessages(
      messages ?? { pages: [], pageParams: [] },
    );
    const repliedMessage = mappedMessages.messages.find(
      (m) => m.id === replyMessageId,
    );

    return repliedMessage?.text ?? '~';
  }, [message.content_attributes.in_reply_to]);

  function handleOpenMenu(): void {
    if (!messageLayoutRef.current) return;

    // Measure position at the moment of long press to get current position
    messageLayoutRef.current.measureInWindow((x, y, width, height) => {
      // On Android, coordinate systems differ between measureInWindow and Modal
      // measureInWindow: includes status bar in Y coordinate
      // Modal with statusBarTranslucent: excludes status bar from coordinate system
      // Use safe area insets which is more reliable than StatusBar.currentHeight
      let adjustedY = y;
      if (Platform.OS === 'android') {
        /**
         * Subtract safe area top to align with Modal coordinate system
         * Using StatusBar.currentHeight to get the height of the status bar
         * This is more reliable than using useSafeAreaInsets() that returns 0 on Android
         */
        adjustedY = y + (StatusBar.currentHeight ?? 0);
      }
      // Store message position to render it above blur
      setMessagePosition({ x, y: adjustedY, width, height });
      const menuWidth = MENU_WIDTH;
      // More accurate menu height: 2 items × (py-sm × 2 + text height ~20px) ≈ 72px
      // Adding border and shadow buffer
      const menuHeight = 80;
      const spacing = 4;
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get('window');
      const safeAreaBottom = 100; // Safe area at bottom

      // Calculate Y position - prefer below, fallback to above
      let menuY = adjustedY + height + spacing;
      const showAbove =
        menuY + menuHeight > screenHeight - safeAreaBottom &&
        y > menuHeight + spacing;

      if (showAbove) {
        // Position menu above: make it closer to match visual spacing when below
        // Shadow creates visual gap, so use minimal spacing
        menuY = y - menuHeight + 6;
      }

      // Calculate X position - align based on message direction, ensure it stays on screen
      let menuX = isOutgoing ? x + width - menuWidth : x;

      // Ensure menu doesn't overflow screen edges
      if (menuX < spacing) {
        menuX = spacing;
      } else if (menuX + menuWidth > screenWidth - spacing) {
        menuX = screenWidth - menuWidth - spacing;
      }

      setMenuPosition({ x: menuX, y: menuY });
      setIsMenuOpen(true);
    });
  }

  function handleCloseMenu(): void {
    setIsMenuOpen(false);
    setIsHighlighted(false);
    setMenuPosition(null);
    setMessagePosition(null);
  }

  function handleCopy(): void {
    if (message.text) {
      Clipboard.setStringAsync(message.text);
      snackbar.success('Message copied');
    }
    handleCloseMenu();
  }

  function handleDelete(): void {
    if (onDelete) {
      onDelete(message.id);
    }
    handleCloseMenu();
  }

  const longPressGesture = Gesture.LongPress()
    .enabled(Boolean(onDelete))
    .minDuration(500)
    .maxDistance(20)
    .onStart(() => {
      runOnJS(setIsHighlighted)(true);
      runOnJS(handleOpenMenu)();
    });

  function getMessageType(): MessageType {
    if (isPrivate) return 'private';

    if (isTemplate) return 'template';

    if (isOutgoing) return 'outgoing';

    return 'incoming';
  }

  function handleImagePress(imageUrl: string): void {
    imagePreviewRef.current?.open(imageUrl);
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
      const fullImageUrl = attachment.data_url || attachment.thumb_url;
      const thumbnailUrl = attachment.thumb_url || attachment.data_url;
      const aspectRatio =
        attachment.width && attachment.height
          ? attachment.width / attachment.height
          : 1;

      return (
        <Clickable
          key={attachment.id}
          onPress={() => handleImagePress(fullImageUrl)}
          className="mb-xs overflow-hidden rounded-md"
        >
          <Image
            source={{ uri: thumbnailUrl }}
            style={{
              width: '100%',
              maxWidth: 250,
              aspectRatio: aspectRatio,
            }}
            contentFit="cover"
            className="rounded-md"
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

  // TODO: Render other message types
  // if (message.content_attributes) {}
  // if (message.content_type === 'incoming_email') {}
  // if (isEmailInbox && !message.private) {}

  // Render regular message with bubble
  return (
    <>
      <GestureDetector gesture={longPressGesture}>
        <View
          ref={messageLayoutRef}
          className={twMerge(
            messageBubbleVariants({ type: getMessageType() }),
            isHighlighted && 'opacity-100',
          )}
          style={isHighlighted ? { zIndex: 1000 } : undefined}
        >
          <MessageBubbleContent
            message={message}
            messageType={getMessageType()}
            replyMessage={replyMessage}
            attachments={attachments}
            isReplyMessage={isReplyMessage}
            hasAttachments={hasAttachments}
            renderAttachment={renderAttachment}
          />
        </View>
      </GestureDetector>
      <ImagePreviewModal ref={imagePreviewRef} />
      {isMenuOpen && menuPosition && messagePosition && (
        <MessageContextMenu
          position={menuPosition}
          messagePosition={messagePosition}
          message={message}
          messageType={getMessageType()}
          replyMessage={replyMessage}
          attachments={attachments}
          isReplyMessage={isReplyMessage}
          hasAttachments={hasAttachments}
          renderAttachment={renderAttachment}
          onCopy={handleCopy}
          onDelete={handleDelete}
          onClose={handleCloseMenu}
        />
      )}
    </>
  );
}

interface MessageContextMenuProps {
  position: { x: number; y: number };
  messagePosition: { x: number; y: number; width: number; height: number };
  message: ChatMessage;
  messageType: MessageType;
  replyMessage?: string;
  attachments: Attachment[];
  isReplyMessage: boolean | number | undefined;
  hasAttachments: boolean;
  renderAttachment: (attachment: Attachment) => React.JSX.Element;
  onCopy: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function MessageContextMenu({
  position,
  messagePosition,
  message,
  messageType,
  replyMessage,
  attachments,
  isReplyMessage,
  hasAttachments,
  renderAttachment,
  onCopy,
  onDelete,
  onClose,
}: MessageContextMenuProps): React.JSX.Element {
  const blurOpacity = useSharedValue(0);

  // Animate blur in on mount
  useEffect(() => {
    blurOpacity.value = withTiming(1, { duration: 200 });
  }, []);

  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View style={[StyleSheet.absoluteFill, blurStyle]}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 30 : 20}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </View>
        {/* Render message bubble above blur to keep it readable */}
        <View
          style={{
            position: 'absolute',
            left: messagePosition.x,
            top: messagePosition.y,
            width: messagePosition.width,
            height: messagePosition.height,
          }}
          pointerEvents="none"
        >
          <View
            className={twMerge(messageBubbleVariants({ type: messageType }))}
          >
            <MessageBubbleContent
              message={message}
              messageType={messageType}
              replyMessage={replyMessage}
              attachments={attachments}
              isReplyMessage={isReplyMessage}
              hasAttachments={hasAttachments}
              renderAttachment={renderAttachment}
            />
          </View>
        </View>
        <View
          className="absolute bg-transparent"
          style={{ left: position.x, top: position.y, minWidth: MENU_WIDTH }}
        >
          <View className="bg-surface border-border overflow-hidden rounded-lg border shadow-lg">
            <Clickable
              onPress={onCopy}
              className="px-md py-sm gap-sm border-border active:bg-surface-soft flex-row items-center border-b"
            >
              <Icon name="copy" size="base" className="text-foreground" />
              <Text variant="bodyS">Copy</Text>
            </Clickable>
            <Clickable
              onPress={onDelete}
              className="px-md py-sm gap-sm active:bg-surface-soft flex-row items-center"
            >
              <Icon name="trash" size="base" className="text-danger" />
              <Text variant="bodyS" className="text-danger">
                Delete
              </Text>
            </Clickable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SystemMessage({
  currentMessage,
}: SystemMessageProps<ChatMessage>): React.JSX.Element {
  const isDeleted = Boolean(currentMessage.content_attributes.deleted);

  return (
    <Text
      variant="bodyXS"
      color="muted"
      className="font-map-medium my-xs text-center font-medium"
    >
      {currentMessage.text}{' '}
      {isDeleted ? null : dayjs(currentMessage.createdAt).format('HH:mm')}
    </Text>
  );
}

function DaySeparator({ createdAt }: DayProps): React.JSX.Element {
  return (
    <View className="py-sm flex-row items-center justify-center">
      <View className="bg-muted px-sm py-xs rounded-full">
        <Text variant="labelXS" color="muted">
          {dayjs(createdAt).format('D MMMM')}
        </Text>
      </View>
    </View>
  );
}

function TextMarkdown({
  text,
  isPrivate,
  isOutgoing,
}: {
  text: string;
  isPrivate: boolean;
  isOutgoing: boolean;
}): React.JSX.Element {
  const [textForeground, textForegroundInverted, textPrivate] = useCSSVariable([
    '--color-foreground',
    '--color-foreground-inverted',
    '--color-yellow-600',
  ]) as [string, string, string];
  const textColor = isPrivate
    ? textPrivate
    : isOutgoing
      ? textForegroundInverted
      : textForeground;

  return (
    <Markdown
      markdownit={MarkdownIt({ typographer: true, linkify: true })}
      mergeStyle
      style={{
        text: {
          fontSize: 14,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: textColor,
        },
        strong: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontWeight: '600',
          color: textColor,
        },
        em: {
          fontStyle: 'italic',
          color: textColor,
        },
        paragraph: {
          marginTop: 0,
          marginBottom: 0,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: textColor,
        },
        bullet_list: {
          minWidth: 200,
          color: textColor,
        },
        ordered_list: {
          minWidth: 200,
          color: textColor,
        },
        list_item: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          color: textColor,
        },
        bullet_list_icon: {
          marginLeft: 0,
          marginRight: 8,
          fontWeight: '900',
        },
        ordered_list_icon: {
          marginLeft: 0,
          marginRight: 8,
          fontWeight: '900',
        },
      }}
    >
      {text}
    </Markdown>
  );
}

MessageItem.displayName = 'MessageItem';

MessageItem.SystemMessage = SystemMessage;
MessageItem.DaySeparator = DaySeparator;
