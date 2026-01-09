import { API } from '@/lib/axios';
import { attributeEndpoints } from '../../constants/endpoints';
import { ListCustomAttributeDefinitionsResponse } from './types';

/**
 * Lists the custom attribute definitions for the given account.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the custom attribute definitions.
 */
export async function listCustomAttributeDefinitions(
  accountId: number,
): Promise<ListCustomAttributeDefinitionsResponse> {
  const response = await API.get<ListCustomAttributeDefinitionsResponse>(
    attributeEndpoints.list(accountId),
  );

  return response.data;
}
