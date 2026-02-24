import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

import { useAuthStore } from '@/store';
import { API } from './axios';

const APP_KEY = process.env.EXPO_PUBLIC_WEBSOCKET_APP_KEY;
const HOST = process.env.EXPO_PUBLIC_WEBSOCKET_HOST;
const PORT = Number(process.env.EXPO_PUBLIC_WEBSOCKET_PORT);
const SCHEME = process.env.EXPO_PUBLIC_WEBSOCKET_SCHEME;
const CLUSTER = process.env.EXPO_PUBLIC_WEBSOCKET_CLUSTER;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const echo = new Echo({
  broadcaster: 'pusher',
  Pusher,
  key: APP_KEY,
  cluster: CLUSTER,
  wsHost: HOST,
  wsPort: PORT,
  wssPort: PORT,
  forceTLS: SCHEME === 'https',
  disableStats: true,
  enabledTransports: ['ws'],
  authEndpoint: `${API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token?.accessToken}`,
      'X-Tenant-ID': useAuthStore.getState().user?.tenant_id || '',
    },
  },
  authorizer: (channel) => {
    return {
      authorize: async (socketId, callback) => {
        try {
          const authorize = await API.post('/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name,
          });
          callback(null, authorize.data);
        } catch (error) {
          callback(error as Error, null);
        }
      },
    };
  },
});
