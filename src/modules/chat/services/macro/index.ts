import { API } from '@/lib/axios';
import { macroEndpoints } from '../../constants/endpoints';
import { ConversationMacrosResponse } from './types';

/**
 * Lists the macros for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the macros.
 */
export async function listMacros(
  accountId: number,
): Promise<ConversationMacrosResponse> {
  const response = await API.get<ConversationMacrosResponse>(
    macroEndpoints.list(accountId),
  );

  return response.data;
}
