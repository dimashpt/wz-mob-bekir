import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listMacros } from '.';
import { macroKeys } from '../../constants/keys';
import { ConversationMacrosResponse } from './types';

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
    queryKey: macroKeys.list(chatUser!.account_id),
    queryFn: () => listMacros(chatUser!.account_id),
  });

  return query;
}
