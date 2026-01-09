import { API } from '@/lib/axios';
import { shipmentEndpoints } from '../../constants/endpoints';
import { LogisticProvidersParams, LogisticProvidersResponse } from './types';

/**
 * Fetches logistics from the API.
 * @returns A promise that resolves to the logistics.
 */
export async function getLogistics(
  params: LogisticProvidersParams,
): Promise<LogisticProvidersResponse> {
  const response = await API.get<LogisticProvidersResponse>(
    shipmentEndpoints.logistics,
    { params, timeout: 100_000 },
  );

  return response.data;
}

export * from './types';
