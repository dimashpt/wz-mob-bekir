import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/store';
import { listLabels } from '.';
import { labelKeys } from '../../constants/keys';
import { LabelListResponse } from './types';

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
    queryKey: labelKeys.list(chatUser?.account_id ?? 0),
    queryFn: () => listLabels(chatUser?.account_id ?? 0),
  });

  return query;
}
