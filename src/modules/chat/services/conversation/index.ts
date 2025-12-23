import { API } from '@/lib/axios';
import { CONVERSATIONS_ENDPOINTS } from '../../constants/endpoints';
import {
  ListConversationsParams,
  ListConversationsResponse,
  UpdateAssigneePayload,
  UpdateAssigneeResponse,
  UpdateAssigneeTeamPayload,
  UpdatePriorityPayload,
  UpdatePriorityResponse,
  UpdateStatusPayload,
  UpdateStatusResponse,
} from './types';

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

/**
 * Updates the status for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function updateStatus(
  accountId: number,
  conversationId: number,
  payload: UpdateStatusPayload,
): Promise<UpdateStatusResponse> {
  const response = await API.post<UpdateStatusResponse>(
    CONVERSATIONS_ENDPOINTS.UPDATE_STATUS(accountId, conversationId),
    payload,
  );

  return response.data;
}

/**
 * Updates the assignee for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function updateAssignee(
  accountId: number,
  conversationId: number,
  payload: UpdateAssigneePayload | UpdateAssigneeTeamPayload,
): Promise<UpdateAssigneeResponse> {
  const response = await API.post<UpdateAssigneeResponse>(
    CONVERSATIONS_ENDPOINTS.UPDATE_ASSIGNEE(accountId, conversationId),
    payload,
  );

  return response.data;
}

/**
 * Updates the priority for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function updatePriority(
  accountId: number,
  conversationId: number,
  payload: UpdatePriorityPayload,
): Promise<UpdatePriorityResponse> {
  const response = await API.post<UpdatePriorityResponse>(
    CONVERSATIONS_ENDPOINTS.UPDATE_PRIORITY(accountId, conversationId),
    payload,
  );

  return response.data;
}
