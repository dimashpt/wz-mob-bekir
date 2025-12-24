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
  listAssignableAgents,
  listMacros,
  listMessages,
  listParticipants,
  listTeams,
  updateLastSeen,
} from '.';
import { CONVERSATIONS_ENDPOINTS } from '../../constants/endpoints';
import { Conversation } from '../conversation/types';
import {
  ConversationAssignableAgentsParams,
  ConversationAssignableAgentsResponse,
  ConversationMacrosResponse,
  ConversationMessagesResponse,
  ConversationParticipantsResponse,
  ConversationTeamsResponse,
} from './types';

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
    queryKey: [
      CONVERSATIONS_ENDPOINTS.UPDATE_LAST_SEEN(
        chatUser?.account_id ?? 0,
        conversationId,
      ),
    ],
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
    queryKey: [
      CONVERSATIONS_ENDPOINTS.MESSAGES(
        chatUser?.account_id ?? 0,
        conversationId,
      ),
      'infinite',
    ],
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
    queryKey: [
      CONVERSATIONS_ENDPOINTS.PARTICIPANTS(
        chatUser?.account_id ?? 0,
        conversationId,
      ),
    ],
    queryFn: () => listParticipants(chatUser!.account_id, conversationId),
  });

  return query;
}

/**
 * Custom hook to fetch macros for a conversation.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing macros.
 * @template T - The type of data returned after selection (defaults to ConversationMacrosResponse).
 */
export function useListMacrosQuery<T = ConversationMacrosResponse>(
  params: Omit<
    UseQueryOptions<ConversationMacrosResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ConversationMacrosResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: [CONVERSATIONS_ENDPOINTS.MACROS(chatUser!.account_id)],
    queryFn: () => listMacros(chatUser!.account_id),
  });

  return query;
}

/**
 * Custom hook to fetch teams for a conversation.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing teams.
 * @template T - The type of data returned after selection (defaults to ConversationTeamsResponse).
 */
export function useListTeamsQuery<T = ConversationTeamsResponse>(
  params: Omit<
    UseQueryOptions<ConversationTeamsResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ConversationTeamsResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: [CONVERSATIONS_ENDPOINTS.TEAMS(chatUser!.account_id)],
    queryFn: () => listTeams(chatUser!.account_id),
  });
  return query;
}

/**
 * Custom hook to fetch assignable agents for a conversation.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing assignable agents.
 * @template T - The type of data returned after selection (defaults to ConversationAssignableAgentsResponse).
 */
export function useListAssignableAgentsQuery<
  T = ConversationAssignableAgentsResponse,
>(
  params: Omit<
    UseQueryOptions<ConversationAssignableAgentsResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  requestParams: ConversationAssignableAgentsParams,
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ConversationAssignableAgentsResponse, Error, T>({
    ...params,
    enabled: params.enabled ?? Boolean(chatUser?.account_id),
    queryKey: [
      CONVERSATIONS_ENDPOINTS.ASSIGNABLE_AGENTS(chatUser?.account_id ?? 0),
    ],
    queryFn: () => listAssignableAgents(chatUser!.account_id, requestParams),
  });
  return query;
}
