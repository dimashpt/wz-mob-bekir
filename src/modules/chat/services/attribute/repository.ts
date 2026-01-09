import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listCustomAttributeDefinitions } from '.';
import { attributeKeys } from '../../constants/keys';
import { ListCustomAttributeDefinitionsResponse } from './types';

/**
 * Custom hook to fetch custom attribute definitions.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing custom attribute definitions.
 * @template T - The type of data returned after selection (defaults to ListCustomAttributeDefinitionsResponse).
 */
export function useListCustomAttributeDefinitionsQuery<
  T = ListCustomAttributeDefinitionsResponse,
>(
  params: Omit<
    UseQueryOptions<ListCustomAttributeDefinitionsResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const { chatUser } = useAuthStore();

  const query = useQuery<ListCustomAttributeDefinitionsResponse, Error, T>({
    ...params,
    enabled: Boolean(chatUser?.account_id),
    queryKey: attributeKeys.list(chatUser!.account_id),
    queryFn: () => listCustomAttributeDefinitions(chatUser!.account_id),
  });
  return query;
}
