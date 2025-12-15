import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { WAREHOUSE_ENDPOINTS } from '../../constants/endpoints';
import { WarehouseListRequestParams, WarehouseListResponse } from './types';

/**
 * Fetches warehouses from the API.
 * @returns A promise that resolves to the warehouses.
 */
export async function getWarehouses(
  params: WarehouseListRequestParams,
): Promise<WarehouseListResponse> {
  const response = await API.get<SuccessResponse<WarehouseListResponse>>(
    WAREHOUSE_ENDPOINTS.LIST_WAREHOUSES,
    { params },
  );

  return response.data.data;
}

export * from './types';
