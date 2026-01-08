import { API } from '@/lib/axios';
import { inboxEndpoints } from '../../constants/endpoints';
import { InboxListResponse } from './types';

/**
 * Lists the inboxes for the given account.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the inboxes.
 */
export async function listInboxes(
  accountId: number,
): Promise<InboxListResponse> {
  const response = await API.get<InboxListResponse>(
    inboxEndpoints.list(accountId),
  );

  return response.data;
}
