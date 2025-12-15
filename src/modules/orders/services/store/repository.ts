import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { STORE_ENDPOINTS } from '../../constants/endpoints';
import * as StoreService from './index';
import { StoreListRequestParams, StoreListResponse } from './types';

/**
 * Custom hook to fetch stores with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - Query parameters for filtering stores (excluding page, which is handled by infinite query).
 * @returns The infinite query object containing paginated store information.
 * @template T - The type of data returned after selection (defaults to StoreListResponse).
 */
export function useStoresInfiniteQuery<T = InfiniteData<StoreListResponse>>(
  params: Omit<
    UseInfiniteQueryOptions<
      StoreListResponse,
      Error,
      T,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  requestParams: Omit<StoreListRequestParams, 'page'> = {},
): UseInfiniteQueryResult<T, Error> {
  const query = useInfiniteQuery<
    StoreListResponse,
    Error,
    T,
    readonly unknown[],
    number
  >({
    ...params,
    queryKey: [STORE_ENDPOINTS.LIST_STORES, 'infinite', requestParams],
    queryFn: ({ pageParam }) =>
      StoreService.getStores({
        per_page: 10,
        sort_by: 'updated_at',
        sort_order: 'desc',
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
