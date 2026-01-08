import { useEffect, useRef } from 'react';

import { InfiniteData } from '@tanstack/react-query';

import { WebSocketConnector } from '@/lib/action-cable';
import { queryClient } from '@/lib/react-query';
import { conversationKeys } from '@/modules/chat/constants/keys';
import {
  ConversationMessagesResponse,
  Message,
} from '@/modules/chat/services/conversation/types';
import { useAuthStore } from '@/store';

export function useWebsocket(): void {
  const connectorRef = useRef<WebSocketConnector | null>(null);

  const { chatUser } = useAuthStore();

  useEffect(() => {
    // Only initialize if all required values are present
    if (!chatUser?.pubsub_token || !chatUser?.account_id || !chatUser?.id) {
      return;
    }

    // Type narrowing - TypeScript now knows these are defined
    const token = chatUser.pubsub_token;
    const account = chatUser.account_id;
    const user = chatUser.id;

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

    async function onMessageCreated(_: string, data: Message): Promise<void> {
      const queryKey = conversationKeys.messages(
        account,
        String(data.conversation_id),
      );

      // Cancel any outgoing refetches
      // (so they don't overwrite the optimistic update)
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          return {
            ...old,
            pages: old.pages.map((page, index) => ({
              ...page,
              // Append the message to the first page
              payload: index === 0 ? [...page.payload, data] : page.payload,
            })),
          };
        },
      );
    }

    async function onMessageUpdated(_: string, data: Message): Promise<void> {
      const queryKey = conversationKeys.messages(
        account,
        String(data.conversation_id),
      );

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<ConversationMessagesResponse>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              payload: page.payload.map((message) =>
                message.id === data.id ? data : message,
              ),
            })),
          };
        },
      );
    }

    // Initialize the connector
    connectorRef.current = new WebSocketConnector(token, account, user);
    connectorRef.current.events = events;

    // Cleanup function
    return () => {
      connectorRef.current = null;
    };
  }, [chatUser]);
}
