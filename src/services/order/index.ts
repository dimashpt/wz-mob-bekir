import { SuccessResponse } from '@/@types/api';
import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import {
  OrderDetailsResponse,
  OrderRequestParams,
  OrderResponse,
} from './types';

/**
 * Fetches orders from the API.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the orders.
 */
export async function getOrders(
  params: OrderRequestParams,
): Promise<OrderResponse> {
  const response = await API.get<SuccessResponse<OrderResponse>>(
    ORDER_ENDPOINTS.LIST_ORDERS,
    { params },
  );

  return response.data.data;
}

/**
 * Fetches order details from the API.
 * @param id - The ID of the order.
 * @returns A promise that resolves to the order details.
 */
export async function getOrderDetails(
  id: string,
): Promise<OrderDetailsResponse> {
  const response = await API.get<SuccessResponse<OrderDetailsResponse>>(
    ORDER_ENDPOINTS.GET_ORDER_DETAILS.replace(':id', id),
  );

  return response.data.data;
}

export * from './types';
