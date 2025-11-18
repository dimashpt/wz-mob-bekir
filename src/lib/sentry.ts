import * as SentryLib from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';

import { IS_PRODUCTION } from '@/constants/common';

export const navigationIntegration = __DEV__
  ? null
  : SentryLib.reactNavigationIntegration({
      enableTimeToInitialDisplay: !isRunningInExpoGo(),
    });

SentryLib.init({
  enabled: !__DEV__,
  environment: IS_PRODUCTION ? 'production' : 'development',
  dsn: __DEV__ ? undefined : process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, logs, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  enableLogs: true,

  // Configure Session Replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  enableNative: true,
  integrations: [
    SentryLib.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    ...[navigationIntegration].filter((item) => item !== null),
  ],
  attachScreenshot: true,
  enableAppHangTracking: false,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at
  // https://docs.sentry.io/platforms/react-native/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,
});

export const Sentry = SentryLib;
