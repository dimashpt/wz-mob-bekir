import type { InstalledApp } from '@react-buoy/core';

import React from 'react';

import { FloatingDevTools } from '@react-buoy/core';
import { DebugBordersModal } from '@react-buoy/debug-borders';
import { createEnvVarConfig, envVar, EnvVarsModal } from '@react-buoy/env';
import { NetworkModal } from '@react-buoy/network';
import { ReactQueryDevToolsModal, WifiToggle } from '@react-buoy/react-query';
import { RouteEventsModalWithTabs } from '@react-buoy/route-events';
import {
  EnvLaptopIcon,
  Globe,
  LayersIcon,
  ReactQueryIcon,
  RouteIcon,
  StorageStackIcon,
} from '@react-buoy/shared-ui';
import { StorageModalWithTabs } from '@react-buoy/storage';

import { useAppStore } from '@/store/app-store';

export function DevTools(): React.ReactNode {
  // Configure environment variables to validate
  const { showDevTools, showBetaFeatures } = useAppStore();
  const requiredEnvVars = createEnvVarConfig([
    envVar('APP_VARIANT').exists(),
    envVar('EXPO_PUBLIC_API_URL').exists(),
    envVar('EXPO_PUBLIC_API_SSO_URL').exists(),
    envVar('EXPO_PUBLIC_API_TIMEOUT').exists(),
    envVar('EXPO_PUBLIC_CLIENT_ID').exists(),
    envVar('EXPO_PUBLIC_CLIENT_SECRET').exists(),
    envVar('EXPO_PUBLIC_APP_API_KEY').exists(),
    envVar('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY').exists(),
    envVar('EXPO_PUBLIC_SENTRY_DSN').exists(),
    envVar('SENTRY_AUTH_TOKEN').exists(),
  ]);

  // Configure storage keys to monitor
  const requiredStorageKeys = [
    {
      key: '@app/session',
      expectedType: 'string',
      description: 'Current user session token',
      storageType: 'async',
    },
    {
      key: '@app/settings:theme',
      expectedValue: 'dark',
      description: 'Preferred theme',
      storageType: 'async',
    },
  ];

  const installedApps: InstalledApp[] = [
    {
      id: 'env',
      name: 'ENV',
      description: 'Environment variables debugger',
      slot: 'both',
      icon: ({ size }) => <EnvLaptopIcon size={size} color="#9f6" />,
      component: EnvVarsModal,
      props: { requiredEnvVars },
    },
    {
      id: 'network',
      name: 'NETWORK',
      description: 'Network request logger',
      slot: 'both',
      icon: ({ size }) => <Globe size={size} color="#38bdf8" />,
      component: NetworkModal,
      props: {},
    },
    {
      id: 'storage',
      name: 'STORAGE',
      description: 'AsyncStorage browser',
      slot: 'both',
      icon: ({ size }) => <StorageStackIcon size={size} color="#38f8a7" />,
      component: StorageModalWithTabs,
      props: { requiredStorageKeys },
    },
    {
      id: 'query',
      name: 'REACT QUERY',
      description: 'React Query inspector',
      slot: 'both',
      icon: ({ size }) => <ReactQueryIcon size={size} colorPreset="red" />,
      component: ReactQueryDevToolsModal,
      props: {},
    },
    {
      id: 'wifi-toggle',
      name: 'WIFI TOGGLE',
      description: 'Toggle offline mode',
      slot: 'both',
      icon: ({ size }) => <WifiToggle size={size} />,
      component: () => null,
      props: {},
    },
    {
      id: 'router',
      name: 'ROUTER',
      description: 'Router inspector',
      slot: 'both',
      icon: ({ size }) => <RouteIcon size={size} />,
      component: RouteEventsModalWithTabs,
      props: {},
    },
    {
      id: 'layout-borders',
      name: 'LAYOUT BORDERS',
      description: 'Layout borders inspector',
      slot: 'both',
      icon: ({ size }) => <LayersIcon size={size} />,
      component: DebugBordersModal,
      props: {},
    },
  ];

  // Hide devtools if developer features are not enabled
  if (!showBetaFeatures) return null;

  // Hide devtools if not enabled in staging or development environment
  if (!showDevTools) return null;

  return (
    <FloatingDevTools
      apps={installedApps}
      environment="local"
      userRole="admin"
    />
  );
}
