import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { storeEndpoints } from '../../constants/endpoints';
import { StoreListRequestParams, StoreListResponse } from './types';

/**
 * Fetches stores from the API.
 * @returns A promise that resolves to the stores.
 */
export async function getStores(
  params: StoreListRequestParams,
): Promise<StoreListResponse> {
  const response = await API.get<SuccessResponse<StoreListResponse>>(
    storeEndpoints.list,
    { params },
  );

  return response.data.data;
}

export * from './types';
