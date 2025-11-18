import dayjs from 'dayjs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/lib/mmkv-storage';
import i18n from '@/locales';

export type ColorScheme = 'light' | 'dark' | 'system';

type AppState = {
  language: string;
  theme: ColorScheme;
  showBetaFeatures: boolean;
  showDevTools: boolean;
  pushNotificationsEnabled: boolean;
};

type AppActions = {
  setLanguage: (language: string) => Promise<void>;
  initializeLanguage: () => Promise<void>;
  setTheme: (payload: ColorScheme) => void;
  toggleDevTools: () => void;
  toggleBetaFeatures: () => void;
  setPushNotificationsEnabled: (enabled: boolean) => void;
};

type AppStore = AppState & AppActions;

const initialState: AppState = {
  language: 'en',
  theme: 'system',
  showBetaFeatures: false,
  showDevTools: false,
  pushNotificationsEnabled: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setLanguage: async (language: string): Promise<void> => {
        i18n.changeLanguage(language);
        dayjs.locale(language);

        set({ language: language });
      },

      initializeLanguage: async (): Promise<void> => {
        i18n.changeLanguage(get().language);
        dayjs.locale(get().language);
      },
      setTheme: (payload: ColorScheme): void => {
        set({ theme: payload });
      },
      toggleDevTools: (): void => {
        set({ showDevTools: !get().showDevTools });
      },
      toggleBetaFeatures: (): void => {
        set({ showBetaFeatures: !get().showBetaFeatures });
      },
      setPushNotificationsEnabled: (enabled: boolean): void => {
        set({ pushNotificationsEnabled: enabled });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => mmkvStorage),
      version: 0,
      migrate: (persistedState) =>
        persistedState ? persistedState : initialState,
    },
  ),
);
