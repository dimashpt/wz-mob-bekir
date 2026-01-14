import React, { useEffect } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Clickable, Icon, Text } from '@/components';
import { ChatMessage } from '@/modules/@types/chat';
import { Attachment } from '../services/conversation/types';
import { MessageBubble, MessageType } from './message-bubble';

const MENU_WIDTH = 150;

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

export interface MessageContextMenuProps {
  position: { x: number; y: number };
  messagePosition: { x: number; y: number; width: number; height: number };
  message: ChatMessage;
  messageType: MessageType;
  replyMessage?: ChatMessage;
  attachments: Attachment[];
  hasAttachments: boolean;
  renderAttachment: (attachment: Attachment) => React.JSX.Element;
  onCopy: () => void;
  onReply: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function MessageContextMenu({
  position,
  messagePosition,
  message,
  messageType,
  replyMessage,
  attachments,
  hasAttachments,
  renderAttachment,
  onCopy,
  onReply,
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
            <MessageBubble
              message={message}
              messageType={messageType}
              replyMessage={replyMessage}
              attachments={attachments}
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
              onPress={onReply}
              className="px-md py-sm gap-sm border-border active:bg-surface-soft flex-row items-center border-b"
            >
              <Icon
                name="forward"
                size="base"
                className="text-foreground"
                transform="scale(-1,1)"
              />
              <Text variant="bodyS">Reply</Text>
            </Clickable>
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
