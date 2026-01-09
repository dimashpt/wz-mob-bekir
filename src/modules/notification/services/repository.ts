import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { notificationList } from '.';
import { notificationKeys } from '../constants/keys';
import { ListNotificationParams, ListNotificationResponse } from './types';

/**
 * Custom hook to fetch notification list.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - The request parameters.
 * @returns The query object containing notification list.
 * @template T - The type of data returned after selection (defaults to ListNotificationResponse).
 */
export function useNotificationListQuery<T = ListNotificationResponse>(
  params: Omit<
    UseQueryOptions<ListNotificationResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  requestParams: ListNotificationParams = {},
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ListNotificationResponse, Error, T>({
    ...params,
    queryKey: notificationKeys.list(chatUser?.account_id ?? 0, requestParams),
    queryFn: () => notificationList(chatUser?.account_id ?? 0, requestParams),
  });

  return query;
}
