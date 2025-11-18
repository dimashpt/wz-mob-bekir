import { mmkvStorage } from '@/lib/mmkv-storage';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: async (key: string): Promise<string | null> =>
      mmkvStorage.getItem(key),
    setItem: async (key: string, value: string): Promise<void> =>
      mmkvStorage.setItem(key, value),
  },
});

export default StorybookUIRoot;
