import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { getCustomers } from '.';
import { customerKeys } from '../../constants/keys';
import { CustomerRequestParams, CustomerResponse } from './types';

/**
 * Custom hook to fetch customers.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @returns The query object containing customers.
 * @template T - The type of data returned after selection (defaults to CustomerResponse).
 */
export function useCustomersQuery<T = CustomerResponse>(
  params: Omit<
    UseQueryOptions<CustomerResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  queryParams: CustomerRequestParams,
): UseQueryResult<T, Error> {
  const query = useQuery<CustomerResponse, Error, T>({
    ...params,
    queryKey: customerKeys.list(queryParams),
    queryFn: () =>
      getCustomers({
        page: 1,
        per_page: 10,
        sort_by: 'created_at',
        sort_direction: 'desc',
        ...queryParams,
      }),
  });

  return query;
}
