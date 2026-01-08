import { API } from '@/lib/axios';
import { labelEndpoints } from '../../constants/endpoints';
import { LabelListResponse } from './types';

/**
 * Lists the labels for the given account.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the labels.
 */
export async function listLabels(
  accountId: number,
): Promise<LabelListResponse> {
  const response = await API.get<LabelListResponse>(
    labelEndpoints.list(accountId),
  );

  return response.data;
}
