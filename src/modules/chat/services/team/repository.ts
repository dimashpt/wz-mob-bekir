import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listTeams } from '.';
import { teamKeys } from '../../constants/keys';
import { ConversationTeamsResponse } from './types';

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
  const { user } = useAuthStore();

  const query = useQuery<ConversationTeamsResponse, Error, T>({
    ...params,
    enabled: Boolean(user?.id),
    queryKey: teamKeys.list(user!.id),
    queryFn: () => listTeams(user!.id),
  });
  return query;
}
