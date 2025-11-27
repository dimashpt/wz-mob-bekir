import { SuccessResponse } from '@/@types/api';
import { STORE_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { StoreListRequestParams, StoreListResponse } from './types';

/**
 * Fetches stores from the API.
 * @returns A promise that resolves to the stores.
 */
export async function getStores(
  params: StoreListRequestParams,
): Promise<StoreListResponse> {
  const response = await API.get<SuccessResponse<StoreListResponse>>(
    STORE_ENDPOINTS.LIST_STORES,
    { params },
  );

  return response.data.data;
}

export * from './types';
