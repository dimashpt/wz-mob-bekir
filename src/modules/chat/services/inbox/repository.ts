import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listInboxes } from '.';
import { inboxKeys } from '../../constants/keys';
import { InboxListResponse } from './types';

/**
 * Custom hook to fetch inboxes for an account.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing inboxes.
 * @template T - The type of data returned after selection (defaults to InboxListResponse).
 */
export function useListInboxesQuery<T = InboxListResponse>(
  params: Omit<
    UseQueryOptions<InboxListResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const { user } = useAuthStore();

  const query = useQuery<InboxListResponse, Error, T>({
    ...params,
    enabled: Boolean(user?.id),
    queryKey: inboxKeys.list(user!.id),
    queryFn: () => listInboxes(user!.id),
  });
  return query;
}
