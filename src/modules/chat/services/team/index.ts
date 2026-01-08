import { API } from '@/lib/axios';
import { teamEndpoints } from '../../constants/endpoints';
import { ConversationTeamsResponse } from './types';

/**
 * Lists the teams for the given conversation.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the teams.
 */
export async function listTeams(
  accountId: number,
): Promise<ConversationTeamsResponse> {
  const response = await API.get<ConversationTeamsResponse>(
    teamEndpoints.list(accountId),
  );

  return response.data;
}
