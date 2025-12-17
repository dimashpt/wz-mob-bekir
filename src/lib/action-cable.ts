import { BaseActionCableConnector } from './action-cable-base';

export interface Conversation {}

interface ActionCableConfig {
  pubSubToken: string;
  accountId: number;
  userId: number;
}

class ActionCableConnector extends BaseActionCableConnector {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected events: { [key: string]: (data: any) => void };

  constructor(pubSubToken: string, accountId: number, userId: number) {
    super(pubSubToken, accountId, userId);
    this.events = {
      'conversation.created': this.onConversationCreated,
    };
  }

  onConversationCreated = (data: Conversation): void => {
    console.log('[WS] Conversation created:', data);
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
