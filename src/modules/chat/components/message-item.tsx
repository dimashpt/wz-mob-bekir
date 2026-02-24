import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native';

import { InfiniteData } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BubbleProps } from 'react-native-gifted-chat';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Icon } from '@/components';
import { snackbar } from '@/components/snackbar';
import { queryClient } from '@/lib/react-query';
import { ChatMessage } from '@/modules/@types/chat';
import { MESSAGE_TYPES } from '../constants/flags';
import { conversationKeys } from '../constants/keys';
import {
  Attachment,
  ConversationMessagesResponse,
} from '../services/conversation/types';
import { mapInfiniteMessagesToGiftedChatMessages } from '../utils/message';
import { MessageBubble, MessageType } from './message-bubble';
import { MessageContextMenu } from './message-context-menu';
import { MessageSeparator } from './message-separator';
import { MessageSystem } from './message-system';

interface MessageItemProps extends BubbleProps<ChatMessage> {
  onDelete: (messageId: number) => void;
  onReply?: (message: ChatMessage) => void;
  onPreviewAttachment: (attachment: Attachment) => void;
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

export function MessageItem({
  currentMessage: message,
  onDelete,
  onReply,
  onPreviewAttachment,
}: MessageItemProps): React.JSX.Element {
  const messageLayoutRef = useRef<View>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Swipe gesture animation values
  const swipeTranslateX = useSharedValue(0);
  const swipeOpacity = useSharedValue(0);
  const SWIPE_THRESHOLD = 40;

  const isOutgoing = message.message_type === MESSAGE_TYPES.OUTGOING;
  const isPrivate = message.private;
  const isTemplate = message.message_type === MESSAGE_TYPES.TEMPLATE;
  const attachments = message.attachments ?? [];

  const queryKey = conversationKeys.messages(
    message?.conversation_id?.toString(),
  );
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

    return repliedMessage;
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
      const menuWidth = 150;
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
        menuY = y - menuHeight - 30;
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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleCloseMenu(): void {
    setIsMenuOpen(false);
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

  function handleReply(): void {
    if (onReply) {
      onReply(message);
    }
    handleCloseMenu();
  }

  const longPressGesture = Gesture.LongPress()
    .enabled(Boolean(onDelete))
    .minDuration(500)
    .maxDistance(20)
    .onStart(() => {
      runOnJS(handleOpenMenu)();
    });

  const panGesture = Gesture.Pan()
    .enabled(Boolean(onReply))
    .minDistance(30)
    .onUpdate((event) => {
      // Only allow rightward swipe
      if (event.translationX > 0) {
        swipeTranslateX.value = Math.min(event.translationX, SWIPE_THRESHOLD);
        // Opacity increases as we swipe
        swipeOpacity.value = interpolate(
          event.translationX,
          [0, SWIPE_THRESHOLD],
          [0, 1],
        );
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe threshold reached - trigger reply
        runOnJS(handleReply)();
        // Animate back to start
        swipeTranslateX.value = withSpring(0);
        swipeOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(Haptics.notificationAsync)(
          Haptics.NotificationFeedbackType.Success,
        );
      } else {
        // Below threshold - snap back
        swipeTranslateX.value = withSpring(0);
        swipeOpacity.value = withTiming(0, { duration: 200 });
      }
    });

  function getMessageType(): MessageType {
    if (isPrivate) return 'private';

    if (isTemplate) return 'template';

    if (isOutgoing) return 'outgoing';

    return 'incoming';
  }

  // TODO: Render other message types
  // if (message.content_attributes) {}
  // if (message.content_type === 'incoming_email') {}
  // if (isEmailInbox && !message.private) {}

  // Animated styles for swipe gesture
  const swipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeTranslateX.value }],
  }));

  const swipeIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: swipeOpacity.value,
  }));

  const swipeGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  // Render regular message with bubble
  return (
    <>
      <GestureDetector gesture={swipeGesture}>
        <View ref={messageLayoutRef} className="relative w-full">
          {/* Swipe reply icon background - appears on swipe */}
          {onReply && (
            <Animated.View
              style={swipeIconAnimatedStyle}
              className="px-sm absolute top-0 bottom-0 left-0 items-center justify-center"
              pointerEvents="none"
            >
              <Icon
                name="forward"
                size="base"
                className="text-muted-foreground"
                transform="scale(-1,1)"
              />
            </Animated.View>
          )}
          {/* Message bubble - translates on swipe */}
          <Animated.View
            style={swipeAnimatedStyle}
            className={twMerge(
              messageBubbleVariants({ type: getMessageType() }),
              'z-1',
            )}
          >
            <MessageBubble
              message={message}
              replyMessage={replyMessage}
              attachments={attachments}
              onPreviewAttachment={onPreviewAttachment}
            />
          </Animated.View>
        </View>
      </GestureDetector>
      {isMenuOpen && menuPosition && messagePosition && (
        <MessageContextMenu
          position={menuPosition}
          messagePosition={messagePosition}
          message={message}
          replyMessage={replyMessage}
          attachments={attachments}
          onCopy={handleCopy}
          onReply={handleReply}
          onDelete={handleDelete}
          onClose={handleCloseMenu}
        />
      )}
    </>
  );
}

MessageItem.displayName = 'MessageItem';
MessageItem.SystemMessage = MessageSystem;
MessageItem.DaySeparator = MessageSeparator;
