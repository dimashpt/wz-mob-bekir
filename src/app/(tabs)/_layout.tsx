import React, { JSX } from 'react';

import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TabBar } from '@/components';
import { useAuthStore } from '@/store';

export default function TabLayout(): JSX.Element {
  const { status } = useAuthStore();
  const { t } = useTranslation();

  if (status !== 'loggedIn') {
    return <Redirect href="/login" />;
  }

  // Android/Fallback - Custom TabBar with current design
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Animation causes freezing sometimes
        // animation: 'fade',
        // transitionSpec: {
        //   animation: 'timing',
        //   config: {
        //     duration: 250,
        //   },
        // },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.home'),
          tabBarIcon: () => 'home',
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
        name="products"
        options={{
          title: t('tab.products'),
          tabBarIcon: () => 'product',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab.settings'),
          tabBarIcon: () => 'userSettings',
        }}
      />
    </Tabs>
  );
}
