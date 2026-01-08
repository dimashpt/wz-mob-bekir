import { API } from '@/lib/axios';
import { agentEndpoints } from '../../constants/endpoints';
import {
  ConversationAssignableAgentsParams,
  ConversationAssignableAgentsResponse,
} from './types';

/**
 * Lists the assignable agents for the given conversation.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the assignable agents.
 */
export async function listAssignableAgents(
  accountId: number,
  params: ConversationAssignableAgentsParams,
): Promise<ConversationAssignableAgentsResponse> {
  const response = await API.get<ConversationAssignableAgentsResponse>(
    agentEndpoints.list(accountId),
    { params },
  );

  return response.data;
}
