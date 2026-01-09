import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { productEndpoints } from '../../constants/endpoints';
import { ProductListRequestParams, ProductListResponse } from './types';

/**
 * Fetches products from the API.
 * @returns A promise that resolves to the products.
 */
export async function getProducts(
  params: ProductListRequestParams,
): Promise<ProductListResponse> {
  const response = await API.get<SuccessResponse<ProductListResponse>>(
    productEndpoints.list,
    { params },
  );

  return response.data.data;
}

export * from './types';
