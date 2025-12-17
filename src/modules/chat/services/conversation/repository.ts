import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listConversations } from '.';
import { CONVERSATIONS_ENDPOINTS } from '../../constants/endpoints';
import { ListConversationsParams, ListConversationsResponse } from './types';

/**
 * Custom hook to fetch conversations.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param payload - The payload for the request.
 * @returns The query object containing conversations.
 * @template T - The type of data returned after selection (defaults to ListConversationsResponse).
 */
export function useListConversationQuery<T = ListConversationsResponse>(
  params: Omit<
    UseQueryOptions<ListConversationsResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  requestParams: ListConversationsParams = {
    assignee_type: 'me',
    status: 'open',
    page: 1,
    sort_by: 'latest',
  },
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ListConversationsResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST_CONVERSATIONS, requestParams],
    queryFn: () => listConversations(chatUser?.account_id ?? 0, requestParams),
  });

  return query;
}
