import { SuccessResponse } from '@/@types/api';
import { API } from '@/lib/axios';
import { CUSTOMER_ENDPOINTS, ORDER_ENDPOINTS } from '../../constants/endpoints';
import {
  AddressRequestParams,
  AddressResponse,
  CreateOrderPayload,
  CustomerRequestParams,
  CustomerResponse,
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
    ORDER_ENDPOINTS.GET_ORDER_HISTORIES.replace(':id', id),
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
    ORDER_ENDPOINTS.GET_ADDRESS,
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
    ORDER_ENDPOINTS.CREATE_ORDER,
    payload,
    { timeout: 20_000 },
  );

  return response.data.data;
}

/**
 * Fetches customers from the API.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the customers.
 */
export async function getCustomers(
  params: CustomerRequestParams,
): Promise<CustomerResponse> {
  const response = await API.get<CustomerResponse>(
    CUSTOMER_ENDPOINTS.LIST_CUSTOMERS,
    { params },
  );

  return response.data;
}

export * from './types';
