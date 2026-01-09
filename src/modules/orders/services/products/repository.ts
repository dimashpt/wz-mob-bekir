import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { productKeys } from '../../constants/keys';
import * as ProductService from './index';
import { ProductListRequestParams, ProductListResponse } from './types';

/**
 * Custom hook to fetch products with infinite scrolling/pagination.
 * @param params - Optional parameters for the query, including select for data transformation.
 * @param requestParams - Query parameters for filtering products (excluding page, which is handled by infinite query).
 * @returns The infinite query object containing paginated product information.
 * @template T - The type of data returned after selection (defaults to ProductListResponse).
 */
export function useProductsInfiniteQuery<T = InfiniteData<ProductListResponse>>(
  params: Omit<
    UseInfiniteQueryOptions<
      ProductListResponse,
      Error,
      T,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  > = {},
  requestParams: Omit<ProductListRequestParams, 'page'> = {
    per_page: 10,
  },
): UseInfiniteQueryResult<T, Error> {
  const query = useInfiniteQuery<
    ProductListResponse,
    Error,
    T,
    readonly unknown[],
    number
  >({
    ...params,
    queryKey: productKeys.list(requestParams),
    queryFn: ({ pageParam }) =>
      ProductService.getProducts({
        sort_by: 'created_at',
        sort_direction: 'desc',
        search_by: 'name',
        status: 'published',
        is_stock: true,
        ...requestParams,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.current_page;
      const totalPages = lastPage?.pagination?.last_page;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  return query;
}
