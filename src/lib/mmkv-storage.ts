import type { MMKV } from 'react-native-mmkv';

import { applicationId } from 'expo-application';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';

function generateEncryptionKey(storeKey: string): string {
  let key = SecureStore.getItem(storeKey);

  if (!key) {
    // generate random key with length 32 bytes
    key = Array.from(Crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    SecureStore.setItem(storeKey, key);
  }

  return key;
}
let storage: MMKV | null = null;
let encryptedStorage: MMKV | null = null;

export function getMmkvStorage(): MMKV {
  if (storage) return storage;

  const uniqueStorageId = `${applicationId}_mmkv_storage`;

  storage = createMMKV({
    id: uniqueStorageId,
  });

  return storage;
}

export function getMmkvEncryptedStorage(): MMKV {
  if (encryptedStorage) return encryptedStorage;

  const encryptionKey = generateEncryptionKey('mmkv_encryption_key');
  const uniqueEncryptedStorageId = `${applicationId}_mmkv_encrypted_storage`;

  encryptedStorage = createMMKV({
    id: uniqueEncryptedStorageId,
    encryptionKey,
  });

  return encryptedStorage;
}

export const mmkvStorage = {
  getItem: (name: string): string | null => {
    try {
      const storage = getMmkvStorage();
      const value = storage.getString(name);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const storage = getMmkvStorage();
      storage.set(name, value);
    } catch {}
  },
  removeItem: (name: string): void => {
    try {
      const storage = getMmkvStorage();
      storage.remove(name);
    } catch {}
  },
};

export const mmkvEncryptedStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const storage = getMmkvEncryptedStorage();
      const value = storage.getString(name);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const storage = getMmkvEncryptedStorage();
      storage.set(name, value);
    } catch {}
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const storage = getMmkvEncryptedStorage();
      storage.remove(name);
    } catch {}
  },
};
