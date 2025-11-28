import { SuccessResponse } from '@/@types/api';
import { PRODUCT_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { ProductListRequestParams, ProductListResponse } from './types';

/**
 * Fetches products from the API.
 * @returns A promise that resolves to the products.
 */
export async function getProducts(
  params: ProductListRequestParams,
): Promise<ProductListResponse> {
  const response = await API.get<SuccessResponse<ProductListResponse>>(
    PRODUCT_ENDPOINTS.LIST_PRODUCTS,
    { params },
  );

  return response.data.data;
}

export * from './types';
