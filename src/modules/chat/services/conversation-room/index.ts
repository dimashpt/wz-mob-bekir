import { API } from '@/lib/axios';
import { CONVERSATIONS_ENDPOINTS } from '../../constants/endpoints';
import { Conversation } from '../conversation/types';
import {
  ConversationAssignableAgentsParams,
  ConversationAssignableAgentsResponse,
  ConversationMacrosResponse,
  ConversationMessagesResponse,
  ConversationParticipantsResponse,
  ConversationTeamsResponse,
} from './types';

/**
 * Updates the last seen timestamp for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the conversation.
 */
export async function updateLastSeen(
  accountId: number,
  conversationId: string,
): Promise<Conversation> {
  const response = await API.post<Conversation>(
    CONVERSATIONS_ENDPOINTS.UPDATE_LAST_SEEN(accountId, conversationId),
  );

  return response.data;
}

/**
 * Lists the messages for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the messages.
 */
export async function listMessages(
  accountId: number,
  conversationId: string,
): Promise<ConversationMessagesResponse> {
  const response = await API.get<ConversationMessagesResponse>(
    CONVERSATIONS_ENDPOINTS.MESSAGES(accountId, conversationId),
  );

  return response.data;
}

/**
 * Lists the participants for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the participants.
 */
export async function listParticipants(
  accountId: number,
  conversationId: string,
): Promise<ConversationParticipantsResponse> {
  const response = await API.get<ConversationParticipantsResponse>(
    CONVERSATIONS_ENDPOINTS.PARTICIPANTS(accountId, conversationId),
  );

  return response.data;
}

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
    CONVERSATIONS_ENDPOINTS.MACROS(accountId),
  );

  return response.data;
}

/**
 * Lists the teams for the given conversation.
 * @param accountId - The ID of the account.
 * @returns A promise that resolves to the teams.
 */
export async function listTeams(
  accountId: number,
): Promise<ConversationTeamsResponse> {
  const response = await API.get<ConversationTeamsResponse>(
    CONVERSATIONS_ENDPOINTS.TEAMS(accountId),
  );

  return response.data;
}

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
    CONVERSATIONS_ENDPOINTS.ASSIGNABLE_AGENTS(accountId),
    { params },
  );

  return response.data;
}
