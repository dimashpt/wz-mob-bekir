import React, { JSX, useEffect } from 'react';

import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TabBar } from '@/components';
import { ActionCable } from '@/lib/action-cable';
import { useAppStore, useAuthStore } from '@/store';

export default function TabLayout(): JSX.Element {
  const { showBetaFeatures } = useAppStore();
  const { status } = useAuthStore();
  const { t } = useTranslation();
  const { chatUser } = useAuthStore();

  const hiddenTabs = showBetaFeatures ? [] : [];

  if (status !== 'loggedIn') {
    return <Redirect href="/login" />;
  }

  useEffect(() => {
    if (chatUser?.pubsub_token && chatUser?.account_id && chatUser?.id) {
      ActionCable.init({
        pubSubToken: chatUser.pubsub_token,
        accountId: chatUser.account_id,
        userId: chatUser.id,
      });
    }
  }, [chatUser]);

  // Android/Fallback - Custom TabBar with current design
  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => <TabBar {...props} hiddenRoutes={hiddenTabs} />}
      screenOptions={{
        headerShown: false,
        // Animation causes freezing sometimes, no github issue yet
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 250,
          },
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tab.home'),
          tabBarIcon: () => 'home',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('tab.chat'),
          tabBarIcon: () => 'chat',
          href: null,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tab.orders'),
          tabBarIcon: () => 'order',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab.profile'),
          tabBarIcon: () => 'user',
        }}
      />
    </Tabs>
  );
}
