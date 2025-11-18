import axios, { AxiosError } from 'axios';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import { ErrorResponse } from '@/@types/api';
import { snackbar } from '@/components/snackbar';
import i18n from '@/locales';

function getStandarizedErrorMessage(
  error: AxiosError<ErrorResponse>,
): string | undefined {
  /**
   * Handle session expired error, due to inconsistent API response
   * sometimes it returns text/html, sometimes it returns JSON
   */
  if (error.response?.status === 401) {
    const message = error.response?.data?.message;
    if (message) {
      return message;
    }
    return i18n.t('general.error.session_expired');
  }

  let errorMessage: string | undefined;

  // Standardize error message format - check API response first
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as ErrorResponse;

    // Check for string values in common error fields
    if (typeof data.message === 'string' && data.message.length > 0) {
      errorMessage = data.message;
    } else if (typeof data.error === 'string' && data.error.length > 0) {
      errorMessage = data.error;
    } else if (typeof data.errors === 'string' && data.errors.length > 0) {
      errorMessage = data.errors;
    }
  }

  // Don't fallback to error.message for axios errors - let them be handled based on context
  return errorMessage;
}

/**
 * Centralized error handler for API responses
 */
export function handleMutationError<T extends FieldValues>(
  error: unknown,
  options?: {
    form?: UseFormReturn<T>;
    fallbackMessage?: string;
    showSnackbar?: boolean;
  },
): void {
  const { form, fallbackMessage, showSnackbar = true } = options || {};
  let message: string | undefined;

  if (axios.isAxiosError(error)) {
    const response = error.response?.data as ErrorResponse;
    const errors = response?.errors;

    message = getStandarizedErrorMessage(error);

    // Handle form field errors
    if (errors && form) {
      let hasFormErrors = false;

      Object.entries(errors).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          form.setError(key as FieldPath<T>, {
            type: 'server',
            message: messages[0],
          });
          hasFormErrors = true;
        }
      });

      // Only show snackbar if there are non-form errors
      if (hasFormErrors && !message) {
        return;
      }
    }

    // Fallback to HTTP error message if no API error message
    if (!message && error.message) {
      message = error.message;
    }
  } else if (error instanceof Error) {
    // Only use error message if it's not empty
    if (error?.message && error.message.length > 0) {
      message = error.message;
    } else {
      message = fallbackMessage;
    }
  }

  // Fallback error handling
  if (showSnackbar) {
    snackbar.error(
      message || fallbackMessage || i18n.t('general.error.unexpected_error'),
    );
  }
}
