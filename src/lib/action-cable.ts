import { BaseActionCableConnector } from './action-cable-base';

export interface Conversation {}

interface ActionCableConfig {
  pubSubToken: string;
  accountId: number;
  userId: number;
}

class ActionCableConnector extends BaseActionCableConnector {
  protected events: { [key: string]: (event: string, data: unknown) => void };

  constructor(pubSubToken: string, accountId: number, userId: number) {
    super(pubSubToken, accountId, userId);
    this.events = {
      'message.created': this.onEvent,
      'message.updated': this.onEvent,
      'conversation.created': this.onEvent,
      'conversation.status_changed': this.onEvent,
      'conversation.read': this.onEvent,
      'assignee.changed': this.onEvent,
      'conversation.updated': this.onEvent,
      'conversation.typing_on': this.onEvent,
      'conversation.typing_off': this.onEvent,
      'contact.updated': this.onEvent,
      'notification.created': this.onEvent,
      'notification.deleted': this.onEvent,
      'presence.update': this.onEvent,
    };
  }

  onEvent = (event: string, data: unknown): void => {
    if (event !== 'presence.update') {
      console.log('[WS] Event received:', event);
    }
  };
}

export const ActionCable = {
  init: ({
    pubSubToken,
    accountId,
    userId,
  }: ActionCableConfig): ActionCableConnector => {
    return new ActionCableConnector(pubSubToken, accountId, userId);
  },
};
