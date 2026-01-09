import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { warehouseEndpoints } from '../../constants/endpoints';
import { WarehouseListRequestParams, WarehouseListResponse } from './types';

/**
 * Fetches warehouses from the API.
 * @returns A promise that resolves to the warehouses.
 */
export async function getWarehouses(
  params: WarehouseListRequestParams,
): Promise<WarehouseListResponse> {
  const response = await API.get<SuccessResponse<WarehouseListResponse>>(
    warehouseEndpoints.list,
    { params },
  );

  return response.data.data;
}

export * from './types';
