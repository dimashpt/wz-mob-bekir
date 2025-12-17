import { API } from '@/lib/axios';
import { CONVERSATIONS_ENDPOINTS } from '../../constants/endpoints';
import { ListConversationsParams, ListConversationsResponse } from './types';

/**
 * Lists conversations for the given account.
 * @param accountId - The ID of the account.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the conversations.
 */
export async function listConversations(
  accountId: number,
  params: ListConversationsParams,
): Promise<ListConversationsResponse> {
  const response = await API.get<ListConversationsResponse>(
    CONVERSATIONS_ENDPOINTS.LIST_CONVERSATIONS(accountId),
    { params },
  );

  return response.data;
}
