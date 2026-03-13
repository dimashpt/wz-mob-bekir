import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { conversationDetails, listConversations } from '.';
import { conversationKeys } from '../../constants/keys';
import {
  ConversationDetailsResponse,
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
  requestParams: ListConversationsParams = {},
): UseQueryResult<T, Error> {
  const query = useQuery<ListConversationsResponse, Error, T>({
    ...params,
    queryKey: conversationKeys.list(requestParams),
    queryFn: () => listConversations(requestParams),
  });

  return query;
}

/**
 * Custom hook to fetch the details for a conversation.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param conversationId - The ID of the conversation.
 * @returns The query object containing the conversation details.
 * @template T - The type of data returned after selection (defaults to ConversationDetailsResponse).
 */
// export function useConversationDetailsQuery<T = ConversationDetailsResponse>(
//   params: Omit<
//     UseQueryOptions<ConversationDetailsResponse, Error, T>,
//     'queryKey' | 'queryFn'
//   > = {},
//   conversationId: string,
// ): UseQueryResult<T, Error> {
//   const query = useQuery<ConversationDetailsResponse, Error, T>({
//     ...params,
//     queryKey: conversationKeys.details(conversationId),
//     queryFn: () => conversationDetails(conversationId),
//   });

//   return query;
// }

/**
 * Custom hook to fetch messages for a conversation with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param conversationId - The ID of the conversation.
 * @returns The infinite query object containing paginated messages.
 * @template T - The type of data returned after selection (defaults to InfiniteData<ConversationMessagesResponse>).
 */
export function useConversationDetailsQuery<
  T = InfiniteData<ConversationDetailsResponse>,
>(
  params: Omit<
    UseInfiniteQueryOptions<
      ConversationDetailsResponse,
      Error,
      T,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  conversationId: string,
): UseInfiniteQueryResult<T, Error> {
  const query = useInfiniteQuery<
    ConversationDetailsResponse,
    Error,
    T,
    readonly unknown[],
    number
  >({
    ...params,
    queryKey: conversationKeys.messages(conversationId),
    queryFn: ({ pageParam }) => {
      const beforeId = pageParam === 0 ? undefined : pageParam;
      return conversationDetails(conversationId, String(beforeId));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage?.data.messages?.length === 20;
      // return hasMore ? lastPage?.data.messages?.[0]?.id : undefined;
      return hasMore ? 0 : undefined;
    },
  });

  return query;
}
