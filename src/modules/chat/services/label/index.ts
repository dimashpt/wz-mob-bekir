import { API } from '@/lib/axios';
import { labelEndpoints } from '../../constants/endpoints';
import { LabelListResponse } from './types';

/**
 * Lists the labels for the given account.
 * @returns A promise that resolves to the labels.
 */
export async function listLabels(): Promise<LabelListResponse> {
  const response = await API.get<LabelListResponse>(labelEndpoints.list);

  return response.data;
}
