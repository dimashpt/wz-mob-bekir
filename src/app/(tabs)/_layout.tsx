import React, { JSX } from 'react';

import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Icon as IconComponent, TabBar } from '@/components';
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
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.home'),
          tabBarIcon: ({ color }) => (
            <IconComponent name="home" size="xl" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tab.orders'),
          tabBarIcon: ({ color }) => (
            <IconComponent name="order" size="xl" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('tab.products'),
          tabBarIcon: ({ color }) => (
            <IconComponent name="product" size="xl" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab.settings'),
          tabBarIcon: ({ color }) => (
            <IconComponent name="userSettings" size="xl" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
