import { ActionCable, Cable } from '@kesha-antonov/react-native-action-cable';

import { logger } from '@/utils/logger';

const cable = new Cable({});
const channelName = 'RoomChannel';
const PRESENCE_INTERVAL = 20_000;

export interface ActionCableEvent<T = unknown> {
  event: string;
  data: T;
}

export class BaseActionCableConnector {
  protected events: { [key: string]: (event: string, data: unknown) => void };
  protected accountId: number;

  constructor(pubSubToken: string, accountId: number, userId: number) {
    const connectActionCable = ActionCable.createConsumer(
      `${(process.env.EXPO_PUBLIC_CHAT_BASE_URL ?? '').replace('https', 'wss')}/cable`,
    );

    const channel = cable.setChannel(
      channelName,
      connectActionCable.subscriptions.create(
        {
          channel: channelName,
          pubsub_token: pubSubToken,
          account_id: accountId,
          user_id: userId,
        },
        {
          updatePresence(): void {
            this.perform('update_presence');
          },
        },
      ),
    );

    channel.on('received', this.onReceived);
    channel.on('connected', this.handleConnected);
    channel.on('disconnect', this.handleDisconnected);

    this.events = {};
    this.accountId = accountId;

    setInterval(() => {
      cable.channel(channelName).perform('update_presence');
    }, PRESENCE_INTERVAL);
  }

  protected isAValidEvent = (data: unknown): boolean => {
    const { account_id } = data as { account_id: number };
    return this.accountId === account_id;
  };

  private onReceived = (
    { event, data }: ActionCableEvent = { event: '', data: null },
  ): void => {
    if (this.isAValidEvent(data)) {
      if (this.events[event] && typeof this.events[event] === 'function') {
        this.events[event](event, data);
      }
    }
  };

  private handleConnected(): void {
    logger.info('[WS] Connected');
    // Do something when websocket connected
  }

  private handleDisconnected(): void {
    logger.info('[WS] Disconnected');
    // Do something when websocket disconnected
  }
}
