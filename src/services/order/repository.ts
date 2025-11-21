import {
  DefinedInitialDataOptions,
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
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

/**
 * Custom hook to fetch orders with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - Query parameters for filtering orders (excluding page, which is handled by infinite query).
 * @returns The infinite query object containing paginated order information.
 * @template TData - The type of data returned after selection (defaults to OrderResponse).
 */
export function useOrderInfiniteQuery<TData = InfiniteData<OrderResponse>>(
  params: Omit<
    UseInfiniteQueryOptions<
      OrderResponse,
      Error,
      TData,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  requestParams: Omit<OrderRequestParams, 'page'> = {
    per_page: 10,
  },
): UseInfiniteQueryResult<TData, Error> {
  const query = useInfiniteQuery<
    OrderResponse,
    Error,
    TData,
    readonly unknown[],
    number
  >({
    ...params,
    queryKey: [ORDER_ENDPOINTS.LIST_ORDERS, 'infinite', requestParams],
    queryFn: ({ pageParam }) =>
      OrderService.getOrders({
        ...requestParams,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.page_info?.current_page;
      const totalPages = lastPage?.page_info?.total_pages;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  return query;
}
