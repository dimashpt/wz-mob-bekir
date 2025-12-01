import { SHIPMENT_ENDPOINTS } from '@/constants/endpoints';
import { API } from '@/lib/axios';
import { LogisticProvidersResponse } from './types';

/**
 * Fetches logistics from the API.
 * @returns A promise that resolves to the logistics.
 */
export async function getLogistics(): Promise<LogisticProvidersResponse> {
  const response = await API.get<LogisticProvidersResponse>(
    SHIPMENT_ENDPOINTS.LIST_LOGISTICS,
  );

  return response.data;
}

export * from './types';
