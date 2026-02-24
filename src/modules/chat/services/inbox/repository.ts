import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

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
  const query = useQuery<InboxListResponse, Error, T>({
    ...params,
    queryKey: inboxKeys.list,
    queryFn: listInboxes,
  });
  return query;
}
