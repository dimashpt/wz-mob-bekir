import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { useAppStore, useAuthStore } from '@/store';
import { logger } from '@/utils/logger';

// Setup push notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface UseNotificationReturn {
  notification: Notifications.Notification | undefined;
}

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Platform.OS === 'ios' && !Device.isDevice) {
    // console.warn('Push notification only works on physical device');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error(
      'Permission not granted to get push token for push notification!',
    );
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    logger.info('Project ID not found');
    throw new Error('Project ID not found');
  }

  try {
    const expoPushToken = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    const nativePushToken = (await Notifications.getDevicePushTokenAsync())
      .data;

    logger.info({ expoPushToken, nativePushToken });
    return expoPushToken;
  } catch (error) {
    throw new Error('Error getting push token', { cause: error });
  }
}

export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const { user, pushNotificationToken, setPushNotificationToken } =
    useAuthStore();
  const { pushNotificationsEnabled } = useAppStore();

  useEffect(() => {
    if (!pushNotificationsEnabled) {
      // Unregister from notifications when disabled
      Notifications.unregisterForNotificationsAsync().catch(
        (error: unknown) => {
          logger.error('Error unregistering notifications:', error);
        },
      );

      // Clear the push notification token
      if (pushNotificationToken) {
        setPushNotificationToken(null);
      }

      // Return empty cleanup - React will handle cleanup of previous effect's listeners
      return () => {
        // Cleanup handled by React when dependencies change
      };
    }

    // Register for push notifications only when enabled
    registerForPushNotificationsAsync()
      .then((token) => {
        if (pushNotificationToken !== token) {
          setPushNotificationToken(token ?? '');
        }
      })
      .catch((error: unknown) => {
        logger.error(error);
      });

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    // Listen for notification responses (when user taps notification)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        logger.info('Notification response:', response);
        // Handle notification tap here
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [
    pushNotificationsEnabled,
    pushNotificationToken,
    setPushNotificationToken,
  ]);

  // handle race condition
  useEffect(() => {
    if (pushNotificationToken && user?.user_id && pushNotificationsEnabled) {
      // TODO: Mutation - Send push notification token to server
    }
  }, [pushNotificationToken, user?.user_id, pushNotificationsEnabled]);

  return {
    notification,
  };
}
