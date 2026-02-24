import { API } from '@/lib/axios';
import { teamEndpoints } from '../../constants/endpoints';
import { ConversationTeamsResponse } from './types';

/**
 * Lists the teams for the given conversation.
 * @returns A promise that resolves to the teams.
 */
export async function listTeams(): Promise<ConversationTeamsResponse> {
  const response = await API.get<ConversationTeamsResponse>(teamEndpoints.list);

  return response.data;
}
