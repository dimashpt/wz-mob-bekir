import { API } from '@/lib/axios';
import { customerEndpoints } from '../../constants/endpoints';
import { CustomerRequestParams, CustomerResponse } from './types';

/**
 * Fetches customers from the API.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the customers.
 */
export async function getCustomers(
  params: CustomerRequestParams,
): Promise<CustomerResponse> {
  const response = await API.get<CustomerResponse>(customerEndpoints.list, {
    params,
  });

  return response.data;
}

export * from './types';
