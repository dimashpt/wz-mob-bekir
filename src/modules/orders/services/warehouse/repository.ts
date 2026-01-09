import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { warehouseKeys } from '../../constants/keys';
import * as WarehouseService from './index';
import { WarehouseListRequestParams, WarehouseListResponse } from './types';

/**
 * Custom hook to fetch stores with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - Query parameters for filtering stores (excluding page, which is handled by infinite query).
 * @returns The infinite query object containing paginated store information.
 * @template T - The type of data returned after selection (defaults to StoreListResponse).
 */
export function useWarehousesInfiniteQuery<
  T = InfiniteData<WarehouseListResponse>,
>(
  params: Omit<
    UseInfiniteQueryOptions<
      WarehouseListResponse,
      Error,
      T,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  requestParams: Omit<WarehouseListRequestParams, 'page'> = {
    per_page: 10,
  },
): UseInfiniteQueryResult<T, Error> {
  const query = useInfiniteQuery<
    WarehouseListResponse,
    Error,
    T,
    readonly unknown[],
    number
  >({
    ...params,
    queryKey: warehouseKeys.list(requestParams),
    queryFn: ({ pageParam }) =>
      WarehouseService.getWarehouses({
        ...requestParams,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.current_page;
      const totalPages = lastPage?.pagination?.total_pages;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  return query;
}
