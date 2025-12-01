import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { SHIPMENT_ENDPOINTS } from '@/constants/endpoints';
import { ShipmentService } from '..';
import { LogisticProvidersResponse } from './types';

/**
 * Custom hook to fetch logistic providers.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing logistic providers.
 * @template T - The type of data returned after selection (defaults to LogisticProvidersResponse).
 */
export function useLogisticProvidersQuery<T = LogisticProvidersResponse>(
  params: Omit<
    UseQueryOptions<LogisticProvidersResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<T, Error> {
  const query = useQuery<LogisticProvidersResponse, Error, T>({
    ...params,
    queryKey: [SHIPMENT_ENDPOINTS.LIST_LOGISTICS],
    queryFn: ShipmentService.getLogistics,
  });

  return query;
}
