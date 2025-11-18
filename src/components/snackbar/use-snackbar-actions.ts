import { useSnackbar } from './snackbar-provider';

type UseSnackbarActionsReturnType = {
  error: (message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

export function useSnackbarActions(): UseSnackbarActionsReturnType {
  const { showSnackbar } = useSnackbar();

  const error = (message: string, duration?: number): void => {
    showSnackbar(message, 'error', duration);
  };

  const success = (message: string, duration?: number): void => {
    showSnackbar(message, 'success', duration);
  };

  const info = (message: string, duration?: number): void => {
    showSnackbar(message, 'info', duration);
  };

  return {
    error,
    success,
    info,
  };
}
