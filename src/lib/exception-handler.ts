import { Alert } from 'react-native';

import * as Sentry from '@sentry/react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

export function initExceptionHandler(): void {
  setJSExceptionHandler((error, isFatal) => {
    Sentry.captureException(error, {
      extra: { isFatal },
    });

    Alert.alert(
      'Oops! Something went wrong',
      `Error: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack}`,
    );
  }, false);

  setNativeExceptionHandler((exceptionString) => {
    Alert.alert(
      'Oops! Something went wrong',
      `Native Error: ${exceptionString}`,
    );
  });
}
