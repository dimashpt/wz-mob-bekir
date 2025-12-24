import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listConversations, listLabels } from '.';
import { CONVERSATIONS_ENDPOINTS } from '../../constants/endpoints';
import {
  LabelListResponse,
  ListConversationsParams,
  ListConversationsResponse,
} from './types';

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
  requestParams: ListConversationsParams,
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();
  const finalQueryParams: ListConversationsParams = {
    page: 1,
    assignee_type: 'me',
    status: 'open',
    sort_by: 'latest',
    ...requestParams,
  };

  const query = useQuery<ListConversationsResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: [CONVERSATIONS_ENDPOINTS.LIST_CONVERSATIONS, finalQueryParams],
    queryFn: () =>
      listConversations(chatUser?.account_id ?? 0, finalQueryParams),
  });

  return query;
}

/**
 * Custom hook to fetch labels.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing labels.
 * @template T - The type of data returned after selection (defaults to LabelListResponse).
 */
export function useListLabelsQuery<T = LabelListResponse>(
  params: Omit<
    UseQueryOptions<LabelListResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<LabelListResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: [CONVERSATIONS_ENDPOINTS.LABELS, chatUser?.account_id],
    queryFn: () => listLabels(chatUser?.account_id ?? 0),
  });

  return query;
}
