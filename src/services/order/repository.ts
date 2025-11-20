import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import * as OrderService from './index';
import { OrderParams, OrderResponse } from './types';

type OrderQuery = Omit<
  Partial<
    DefinedInitialDataOptions<
      OrderResponse,
      Error,
      OrderResponse,
      readonly unknown[]
    >
  >,
  'queryKey' | 'queryFn'
>;

/**
 * Custom hook to fetch user information.
 * @param params - Optional parameters for the query.
 * @returns The query object containing user information.
 */
export function useOrderQuery(
  params: OrderQuery = {},
  queryParams: OrderParams = {
    page: 1,
    per_page: 5,
  },
): UseQueryResult<OrderResponse, Error> {
  const query = useQuery<OrderResponse>({
    ...params,
    queryKey: [ORDER_ENDPOINTS.LIST_ORDERS],
    queryFn: () => OrderService.getOrders(queryParams),
  });

  return query;
}
