import {
  keepPreviousData,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';

import { handleMutationError } from '@/utils/error-handler';

// Create a client
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      handleMutationError(error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      retryDelay: 3000,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
      // Anti-spam measures
      staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
      gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      refetchOnMount: 'always', // Always refetch on mount but respect staleTime
      refetchOnReconnect: 'always', // Refetch on reconnect but respect staleTime
      // Prevent excessive background refetching
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Prevent mutation spam
      retry: 0, // Don't retry mutations automatically
      onError(error: unknown) {
        handleMutationError(error);
      },
    },
  },
});
