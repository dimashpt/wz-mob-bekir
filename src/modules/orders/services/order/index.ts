import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { orderEndpoints } from '../../constants/endpoints';
import {
  AddressRequestParams,
  AddressResponse,
  CreateOrderPayload,
  OrderDetailsResponse,
  OrderHistoryParams,
  OrderHistoryResponse,
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
    orderEndpoints.list,
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
    orderEndpoints.details.replace(':id', id),
  );

  return response.data.data;
}

/**
 * Fetches order histories from the API.
 * @param id - The ID of the order.
 * @returns A promise that resolves to the order histories.
 */
export async function getOrderHistories(
  id: string,
  params: OrderHistoryParams,
): Promise<OrderHistoryResponse> {
  const response = await API.get<SuccessResponse<OrderHistoryResponse>>(
    orderEndpoints.detailHistory.replace(':id', id),
    { params },
  );

  return response.data.data;
}

/**
 * Fetches addresses autocomplete from the API.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the addresses autocomplete.
 */
export async function getAddress(
  params: AddressRequestParams,
): Promise<AddressResponse> {
  const response = await API.get<SuccessResponse<AddressResponse>>(
    orderEndpoints.address,
    { params },
  );

  return response.data.data;
}

/**
 * Creates an order from the API.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the created order.
 */
export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const response = await API.post<SuccessResponse<OrderResponse>>(
    orderEndpoints.create,
    payload,
    { timeout: 20_000 },
  );

  return response.data.data;
}

export * from './types';
