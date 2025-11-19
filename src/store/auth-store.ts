import * as Notifications from 'expo-notifications';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { initializeAuthInterceptors } from '@/lib/axios';
import { mmkvEncryptedStorage } from '@/lib/mmkv-storage';
import { queryClient } from '@/lib/react-query';
import { LoginResponse } from '@/services/auth/types';
import { User } from '@/services/user/types';

type AuthStatus = 'firstLogin' | 'loggedIn' | 'loggedOut';

export type TokenType = {
  accessToken: string;
  refreshToken?: string;
};

type AuthState = {
  status: AuthStatus;
  token: TokenType | null;
  user: User | null;
  pushNotificationToken: string | null;
};

type AuthActions = {
  setUser: (user: Partial<User>) => void;
  setToken: (credentials: LoginResponse) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => Promise<void>;
  setPushNotificationToken: (token: AuthState['pushNotificationToken']) => void;
};

const initialState: AuthState = {
  status: 'loggedOut',
  token: null,
  user: null,
  pushNotificationToken: null,
};

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set({ user: { ...get().user, ...user } as User }),
      setToken: (credentials) => {
        set((state) => ({
          ...state,
          token: {
            accessToken: credentials.auth_token,
          },
        }));
      },
      setStatus: (status) => set({ status }),
      logout: async () => {
        Notifications.setBadgeCountAsync(0);

        if (get().pushNotificationToken) {
          // TODO: Remove push notification token from server

          Notifications.cancelAllScheduledNotificationsAsync();
          Notifications.unregisterForNotificationsAsync();
        }

        set(initialState);

        queryClient.clear();
      },
      setPushNotificationToken: (token: AuthState['pushNotificationToken']) => {
        set((state) => ({
          ...state,
          pushNotificationToken: token,
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvEncryptedStorage),
      version: 0,
      migrate: (persistedState) =>
        persistedState ? persistedState : initialState,
    },
  ),
);

// Initialize auth interceptors after store creation
async function refreshTokenFn(): Promise<LoginResponse> {
  const { token } = useAuthStore.getState();

  if (!token?.refreshToken) {
    throw new Error('No refresh token available');
  }

  // Import auth service directly to avoid cycles
  const { refreshToken: refreshTokenService } = await import('@/services/auth');
  const refreshedData = await refreshTokenService();

  // Update tokens in the auth store
  useAuthStore.getState().setToken(refreshedData);

  return refreshedData;
}

initializeAuthInterceptors(() => {
  const { token, logout } = useAuthStore.getState();

  return { token, logout };
}, refreshTokenFn);
