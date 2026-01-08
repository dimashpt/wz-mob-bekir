import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listAssignableAgents } from '.';
import { agentKeys } from '../../constants/keys';
import {
  ConversationAssignableAgentsParams,
  ConversationAssignableAgentsResponse,
} from './types';

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
    queryKey: agentKeys.list(chatUser!.account_id, requestParams),
    queryFn: () => listAssignableAgents(chatUser!.account_id, requestParams),
  });
  return query;
}
