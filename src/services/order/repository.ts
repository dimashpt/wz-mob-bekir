import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import * as OrderService from './index';
import { OrderRequestParams, OrderResponse } from './types';

type UseOrderQueryParams<T> = Omit<
  Partial<
    DefinedInitialDataOptions<OrderResponse, Error, T, readonly unknown[]>
  >,
  'queryKey' | 'queryFn'
>;

/**
 * Custom hook to fetch order information.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param queryParams - Query parameters for filtering orders.
 * @returns The query object containing order information.
 * @template TData - The type of data returned after selection (defaults to OrderResponse).
 */
export function useOrderQuery<TData = OrderResponse>(
  params: UseOrderQueryParams<TData> = {},
  requestParams: OrderRequestParams = {
    page: 1,
    per_page: 5,
  },
): UseQueryResult<TData, Error> {
  const query = useQuery<OrderResponse, Error, TData>({
    ...params,
    queryKey: [ORDER_ENDPOINTS.LIST_ORDERS, requestParams],
    queryFn: () => OrderService.getOrders(requestParams),
  });

  return query;
}
