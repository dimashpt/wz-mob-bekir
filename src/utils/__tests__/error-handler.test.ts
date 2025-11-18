import { handleMutationError } from '../error-handler';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock snackbar FIRST, before any imports
jest.mock('@/components/snackbar', () => {
  const mockSnackbarError = jest.fn();
  const mockShowSnackbar = jest.fn();
  return {
    snackbar: {
      error: mockSnackbarError,
      success: jest.fn(),
      info: jest.fn(),
      hide: jest.fn(),
    },
    useSnackbar: jest.fn(() => ({
      showSnackbar: mockShowSnackbar,
      hideSnackbar: jest.fn(),
    })),
    SnackbarProvider: ({ children }: any) => children,
  };
});

// Mock i18n
jest.mock('@/locales', () => ({
  t: jest.fn((key) => {
    const translations: Record<string, string> = {
      'general.error.session_expired': 'Session expired',
      'general.error.unexpected_error': 'An unexpected error occurred',
    };
    return translations[key] || key;
  }),
}));

// Mock axios to prevent React Native dependency issues
jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}));

// Get reference to mock for assertions
const mockSnackbar = require('@/components/snackbar');
const mockSnackbarError = mockSnackbar.snackbar.error;

describe('error handler utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMutationError', () => {
    it('should show snackbar with error message for AxiosError', () => {
      const error = new Error('Test error') as any;
      error.isAxiosError = false;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Test error');
    });

    it('should use fallback message when error message is empty', () => {
      const error = new Error('') as any;
      error.isAxiosError = false;

      handleMutationError(error, {
        fallbackMessage: 'Fallback error',
      });

      expect(mockSnackbarError).toHaveBeenCalledWith('Fallback error');
    });

    it('should not show snackbar when showSnackbar is false', () => {
      const error = new Error('Test error') as any;
      error.isAxiosError = false;

      handleMutationError(error, {
        showSnackbar: false,
      });

      expect(mockSnackbarError).not.toHaveBeenCalled();
    });

    it('should use default error message when no message provided', () => {
      const error = {} as any;
      error.message = undefined;
      error.isAxiosError = false;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith(
        'An unexpected error occurred',
      );
    });

    it('should handle Error instances', () => {
      const error = new Error('Custom error message');

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Custom error message');
    });

    it('should handle unknown error types', () => {
      const error = 'String error' as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith(
        'An unexpected error occurred',
      );
    });

    it('should show custom fallback message for unknown errors', () => {
      handleMutationError('unknown error', {
        fallbackMessage: 'Custom fallback',
      });

      expect(mockSnackbarError).toHaveBeenCalledWith('Custom fallback');
    });

    it('should prioritize error.message over fallback for Error instances', () => {
      const error = new Error('Primary message');

      handleMutationError(error, {
        fallbackMessage: 'Fallback message',
      });

      expect(mockSnackbarError).toHaveBeenCalledWith('Primary message');
    });

    it('should handle axios error with message in response', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Network error',
        response: {
          status: 400,
          data: {
            message: 'Server error message',
          },
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Server error message');
    });

    it('should handle axios error with error field', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Network error',
        response: {
          status: 400,
          data: {
            error: 'Field validation error',
          },
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Field validation error');
    });

    it('should handle axios error with errors field', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Network error',
        response: {
          status: 400,
          data: {
            errors: 'Multiple validation errors',
          },
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith(
        'Multiple validation errors',
      );
    });

    it('should handle 401 unauthorized error with session expired message', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Unauthorized',
        response: {
          status: 401,
          data: {
            message: 'Token expired',
          },
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Token expired');
    });

    it('should use session expired translation for 401 without message', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Unauthorized',
        response: {
          status: 401,
          data: {},
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Session expired');
    });

    it('should handle form field errors from axios error', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const mockFormMethods = {
        setError: jest.fn(),
      };

      const error = {
        message: 'Validation error',
        response: {
          status: 422,
          data: {
            errors: {
              email: ['Email is required', 'Email must be valid'],
              password: ['Password must be at least 8 characters'],
            },
          },
        },
      } as any;

      handleMutationError(error, {
        form: mockFormMethods as any,
      });

      expect(mockFormMethods.setError).toHaveBeenCalledWith('email', {
        type: 'server',
        message: 'Email is required',
      });

      expect(mockFormMethods.setError).toHaveBeenCalledWith('password', {
        type: 'server',
        message: 'Password must be at least 8 characters',
      });
    });

    it('should not show snackbar when only form errors exist', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const mockFormMethods = {
        setError: jest.fn(),
      };

      const error = {
        message: 'Validation error',
        response: {
          status: 422,
          data: {
            errors: {
              email: ['Email is required'],
            },
          },
        },
      } as any;

      handleMutationError(error, {
        form: mockFormMethods as any,
      });

      expect(mockSnackbarError).not.toHaveBeenCalled();
    });

    it('should show snackbar with general message if form errors and message exist', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const mockFormMethods = {
        setError: jest.fn(),
      };

      const error = {
        message: 'Validation failed',
        response: {
          status: 422,
          data: {
            message: 'Form validation failed',
            errors: {
              email: ['Email is required'],
            },
          },
        },
      } as any;

      handleMutationError(error, {
        form: mockFormMethods as any,
      });

      expect(mockSnackbarError).toHaveBeenCalledWith('Form validation failed');
    });

    it('should handle empty error messages gracefully', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Network error',
        response: {
          status: 400,
          data: {
            message: '',
            error: '',
            errors: '',
          },
        },
      } as any;

      handleMutationError(error, {
        fallbackMessage: 'Default error',
      });

      expect(mockSnackbarError).toHaveBeenCalledWith('Network error');
    });

    it('should prioritize message over error and errors fields', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Network error',
        response: {
          status: 400,
          data: {
            message: 'Primary message',
            error: 'Secondary error',
            errors: 'Tertiary errors',
          },
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Primary message');
    });

    it('should handle axios error without response data', () => {
      const mockAxios = require('axios');
      (mockAxios.isAxiosError as jest.Mock).mockReturnValue(true);

      const error = {
        message: 'Network error',
        response: {
          status: 500,
          data: null,
        },
      } as any;

      handleMutationError(error);

      expect(mockSnackbarError).toHaveBeenCalledWith('Network error');
    });
  });
});
