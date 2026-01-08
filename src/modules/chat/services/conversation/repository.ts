import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import {
  listConversations,
  listMessages,
  listParticipants,
  updateLastSeen,
} from '.';
import { conversationKeys } from '../../constants/keys';
import {
  Conversation,
  ConversationMessagesResponse,
  ConversationParticipantsResponse,
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
  const { chatUser } = useAuthStore();

  const query = useQuery<ListConversationsResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: conversationKeys.list(chatUser?.account_id ?? 0, requestParams),
    queryFn: () => listConversations(chatUser?.account_id ?? 0, requestParams),
  });

  return query;
}

/**
 * Custom hook to update the last seen timestamp for a conversation.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param conversationId - The ID of the conversation.
 * @returns The query object containing the conversation.
 * @template T - The type of data returned after selection (defaults to Conversation).
 */
export function useUpdateLastSeenQuery<T = Conversation>(
  params: Omit<
    UseQueryOptions<Conversation, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  conversationId: string,
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<Conversation, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id && conversationId),
    queryKey: conversationKeys.updateLastSeen(
      chatUser?.account_id ?? 0,
      conversationId,
    ),
    queryFn: () => updateLastSeen(chatUser?.account_id ?? 0, conversationId),
  });

  return query;
}

/**
 * Custom hook to fetch messages for a conversation with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param conversationId - The ID of the conversation.
 * @returns The infinite query object containing paginated messages.
 * @template T - The type of data returned after selection (defaults to InfiniteData<ConversationMessagesResponse>).
 */
export function useListMessagesInfiniteQuery<
  T = InfiniteData<ConversationMessagesResponse>,
>(
  params: Omit<
    UseInfiniteQueryOptions<
      ConversationMessagesResponse,
      Error,
      T,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  conversationId: string,
): UseInfiniteQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useInfiniteQuery<
    ConversationMessagesResponse,
    Error,
    T,
    readonly unknown[],
    number
  >({
    ...params,
    enabled: Boolean(chatUser?.account_id && conversationId),
    queryKey: conversationKeys.messages(
      chatUser?.account_id ?? 0,
      conversationId,
    ),
    queryFn: ({ pageParam }) => {
      const beforeId = pageParam === 0 ? undefined : pageParam;
      return listMessages(chatUser!.account_id, conversationId, beforeId);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage?.payload?.length === 20;
      return hasMore ? lastPage?.payload?.[0]?.id : undefined;
    },
  });

  return query;
}

/**
 * Custom hook to fetch participants for a conversation.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param conversationId - The ID of the conversation.
 * @returns The query object containing participants.
 * @template T - The type of data returned after selection (defaults to ConversationParticipantsResponse).
 */
export function useListParticipantsQuery<
  T = ConversationParticipantsResponse[],
>(
  params: Omit<
    UseQueryOptions<ConversationParticipantsResponse[], Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  conversationId: string,
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ConversationParticipantsResponse[], Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id && conversationId),
    queryKey: conversationKeys.participants(
      chatUser?.account_id ?? 0,
      conversationId,
    ),
    queryFn: () => listParticipants(chatUser!.account_id, conversationId),
  });

  return query;
}
