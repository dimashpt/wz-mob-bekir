import { SuccessResponse } from '@/@types/api';
import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { OrderParams, OrderResponse } from './types';

/**
 * Fetches orders from the API.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the orders.
 */
export async function getOrders(params: OrderParams): Promise<OrderResponse> {
  const response = await API.get<SuccessResponse<OrderResponse>>(
    ORDER_ENDPOINTS.LIST_ORDERS,
    { params },
  );

  return response.data.data;
}

export * from './types';
