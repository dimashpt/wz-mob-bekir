import { API } from '@/lib/axios';
import { conversationEndpoints } from '../../constants/endpoints';
import {
  ConversationDetailsResponse,
  ListConversationsParams,
  ListConversationsResponse,
  UpdateLabelConversationPayload,
  UpdateLabelConversationResponse,
} from './types';

/**
 * Lists conversations for the given account.
 * @param params - The parameters for the request.
 * @returns A promise that resolves to the conversations.
 */
export async function listConversations(
  params: ListConversationsParams,
): Promise<ListConversationsResponse> {
  const response = await API.get<ListConversationsResponse>(
    conversationEndpoints.list(),
    { params },
  );

  return response.data;
}

/**
 * Gets the details for the given conversation.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function conversationDetails(
  conversationId: string,
  before?: string,
): Promise<ConversationDetailsResponse> {
  const response = await API.get<ConversationDetailsResponse>(
    conversationEndpoints.details(conversationId),
    { params: { before } },
  );

  return response.data;
}

/**
 * Updates the labels for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function updateLabels(
  conversationId: string,
  payload: UpdateLabelConversationPayload,
): Promise<UpdateLabelConversationResponse> {
  const response = await API.post<UpdateLabelConversationResponse>(
    conversationEndpoints.updateLabels(conversationId),
    payload,
  );

  return response.data;
}
