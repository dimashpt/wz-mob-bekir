import { useEffect } from 'react';

import { echo } from '@/lib/echo';
import { Message } from '@/modules/chat/services/conversation/types';
import {
  addMessageToQuery,
  updateConversationLastActivity,
  updateMessageByIdInQuery,
} from '@/modules/chat/utils/message';
import { useAuthStore } from '@/store';

export function useWebsocket(): void {
  const { user } = useAuthStore();

  useEffect(() => {
    // Only initialize if all required values are present
    if (!user?.id) return;

    // Create event handlers
    const events: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: (event: string, data: any) => void;
    } = {
      'message.created': onMessageCreated,
      'message.updated': onMessageUpdated,
      'conversation.created': onEvent,
      'conversation.status_changed': onEvent,
      'conversation.read': onEvent,
      'assignee.changed': onEvent,
      'conversation.updated': onEvent,
      'conversation.typing_on': onEvent,
      'conversation.typing_off': onEvent,
      'contact.updated': onEvent,
      'notification.created': onEvent,
      'notification.deleted': onEvent,
      'presence.update': onEvent,
      'conversation.contact_changed': onEvent,
      'contact.deleted': onEvent,
      'conversation.mentioned': onEvent,
      'first.reply.created': onEvent,
    };

    function onEvent(event: string, _: unknown): void {
      if (event !== 'presence.update') {
        console.log('[WS] Event received:', event);
      }
    }

    function onMessageCreated(_: string, data: Message): void {
      addMessageToQuery(user!.id, String(data.conversation_id), data);
      updateConversationLastActivity(user!.id, data);
    }

    function onMessageUpdated(_: string, data: Message): void {
      updateMessageByIdInQuery(
        user!.id,
        String(data.conversation_id),
        data.id,
        data,
      );
    }

    // Connect to the WebSocket server
    echo.connect();

    // Cleanup function — disconnect Pusher on unmount or when user changes
    return () => {
      echo.disconnect();
    };
  }, [user]);
}
