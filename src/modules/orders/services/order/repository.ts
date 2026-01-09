import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { orderKeys } from '../../constants/keys';
import * as OrderService from './index';
import {
  AddressResponse,
  OrderDetailsResponse,
  OrderHistoryResponse,
  OrderRequestParams,
  OrderResponse,
} from './types';

/**
 * Custom hook to fetch orders with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - Query parameters for filtering orders (excluding page, which is handled by infinite query).
 * @returns The infinite query object containing paginated order information.
 * @template T - The type of data returned after selection (defaults to OrderResponse).
 */
export function useOrderInfiniteQuery<T = InfiniteData<OrderResponse>>(
  params: Omit<
    UseInfiniteQueryOptions<
      OrderResponse,
      Error,
      T,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  requestParams: Omit<OrderRequestParams, 'page'> = {
    per_page: 10,
  },
): UseInfiniteQueryResult<T, Error> {
  const query = useInfiniteQuery<
    OrderResponse,
    Error,
    T,
    readonly unknown[],
    number
  >({
    ...params,
    queryKey: orderKeys.list(requestParams),
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

/**
 * Custom hook to fetch order details.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param id - The ID of the order.
 * @returns The query object containing order details.
 * @template T - The type of data returned after selection (defaults to OrderDetailsResponse).
 */
export function useOrderDetailsQuery<T = OrderDetailsResponse>(
  params: Omit<
    UseQueryOptions<OrderDetailsResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  id: string,
): UseQueryResult<T, Error> {
  const query = useQuery<OrderDetailsResponse, Error, T>({
    ...params,
    queryKey: orderKeys.details(id),
    queryFn: () => OrderService.getOrderDetails(id),
  });

  return query;
}

/**
 * Custom hook to fetch order histories.
 * @param id - The ID of the order.
 * @returns The query object containing order histories.
 * @template T - The type of data returned after selection (defaults to OrderHistoryResponse).
 */
export function useOrderHistoriesQuery<T = OrderHistoryResponse>(
  params: Omit<
    UseQueryOptions<OrderHistoryResponse, Error, T>,
    'queryKey' | 'queryFn'
  >,
  id: string,
): UseQueryResult<T, Error> {
  const query = useQuery<OrderHistoryResponse, Error, T>({
    ...params,
    queryKey: orderKeys.histories(id, {}),
    queryFn: () =>
      OrderService.getOrderHistories(id, {
        page: 1,
        per_page: 100,
      }),
  });

  return query;
}

/**
 * Custom hook to fetch addresses autocomplete.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param search - The search query.
 * @returns The query object containing addresses autocomplete.
 * @template T - The type of data returned after selection (defaults to AddressResponse).
 */
export function useAddressQuery<T = AddressResponse>(
  params: Omit<
    UseQueryOptions<OrderService.AddressResponse, Error, T>,
    'queryKey' | 'queryFn'
  > = {},
  search?: string,
): UseQueryResult<T, Error> {
  const queryParams = {
    page: 1,
    per_page: 5,
    search_by: 'subdistrict',
    search,
  };
  const query = useQuery<OrderService.AddressResponse, Error, T>({
    ...params,
    queryKey: orderKeys.address(queryParams),
    queryFn: () => OrderService.getAddress(queryParams),
  });

  return query;
}
