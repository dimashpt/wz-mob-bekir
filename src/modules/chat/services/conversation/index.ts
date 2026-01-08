import { API } from '@/lib/axios';
import { objectToFormData } from '@/utils/data-transform';
import { conversationEndpoints } from '../../constants/endpoints';
import {
  BulkUpdateActionPayload,
  Conversation,
  ConversationMessagesResponse,
  ConversationParticipantsResponse,
  ListConversationsParams,
  ListConversationsResponse,
  Message,
  SendMessagePayload,
  UnreadConversationResponse,
  UpdateAssigneePayload,
  UpdateAssigneeResponse,
  UpdateAssigneeTeamPayload,
  UpdateLabelConversationPayload,
  UpdateLabelConversationResponse,
  UpdateParticipantsPayload,
  UpdateParticipantsResponse,
  UpdatePriorityPayload,
  UpdatePriorityResponse,
  UpdateStatusPayload,
  UpdateStatusResponse,
  UpdateTypingStatusPayload,
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
    conversationEndpoints.list(accountId),
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
    conversationEndpoints.updateStatus(accountId, conversationId),
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
    conversationEndpoints.updateAssignee(accountId, conversationId),
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
    conversationEndpoints.updatePriority(accountId, conversationId),
    payload,
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
  accountId: number,
  conversationId: number,
  payload: UpdateLabelConversationPayload,
): Promise<UpdateLabelConversationResponse> {
  const response = await API.post<UpdateLabelConversationResponse>(
    conversationEndpoints.updateLabels(accountId, conversationId),
    payload,
  );

  return response.data;
}

/**
 * Updates the participants for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function updateParticipants(
  accountId: number,
  conversationId: string,
  payload: UpdateParticipantsPayload,
): Promise<UpdateParticipantsResponse> {
  const response = await API.put<UpdateParticipantsResponse>(
    conversationEndpoints.participants(accountId, conversationId),
    payload,
  );

  return response.data;
}

/**
 * Bulk updates the action for the given conversations.
 * @param accountId - The ID of the account.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function bulkUpdateAction(
  accountId: number,
  payload: BulkUpdateActionPayload,
): Promise<void> {
  const response = await API.post<void>(
    conversationEndpoints.updateBulk(accountId),
    payload,
  );

  return response.data;
}

/**
 * Unreads the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function unreadConversation(
  accountId: number,
  conversationId: number,
): Promise<UnreadConversationResponse> {
  const response = await API.post<UnreadConversationResponse>(
    conversationEndpoints.unread(accountId, conversationId),
  );

  return response.data;
}

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
    conversationEndpoints.updateLastSeen(accountId, conversationId),
  );

  return response.data;
}

/**
 * Lists the messages for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param before - The first message id to fetch messages before.
 * @returns A promise that resolves to the messages.
 */
export async function listMessages(
  accountId: number,
  conversationId: string,
  before?: number,
): Promise<ConversationMessagesResponse> {
  const response = await API.get<ConversationMessagesResponse>(
    conversationEndpoints.messages(accountId, conversationId),
    { params: { before } },
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
): Promise<ConversationParticipantsResponse[]> {
  const response = await API.get<ConversationParticipantsResponse[]>(
    conversationEndpoints.participants(accountId, conversationId),
  );

  return response.data;
}

/**
 * Updates the typing status for the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function updateTypingStatus(
  accountId: number,
  conversationId: string,
  payload: UpdateTypingStatusPayload,
): Promise<void> {
  const response = await API.post(
    conversationEndpoints.updateTypingStatus(accountId, conversationId),
    payload,
  );

  return response.data;
}

/**
 * Sends a message to the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function sendMessage(
  accountId: number,
  conversationId: string,
  payload: SendMessagePayload,
): Promise<Message> {
  const formData = objectToFormData(payload);

  const response = await API.post(
    conversationEndpoints.sendMessage(accountId, conversationId),
    payload.attachments ? formData : payload,
    {
      headers: payload.attachments
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    },
  );

  return response.data;
}

/**
 * Deletes a message from the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @param messageId - The ID of the message.
 * @returns A promise that resolves to the response.
 */
export async function deleteMessage(
  accountId: number,
  conversationId: string,
  messageId: number,
): Promise<Message> {
  const response = await API.delete<Message>(
    conversationEndpoints.deleteMessage(accountId, conversationId, messageId),
  );

  return response.data;
}

/**
 * Mutes the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function muteConversation(
  accountId: number,
  conversationId: string,
): Promise<void> {
  const response = await API.post(
    conversationEndpoints.mute(accountId, conversationId),
  );

  return response.data;
}

/**
 * Unmutes the given conversation.
 * @param accountId - The ID of the account.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function unmuteConversation(
  accountId: number,
  conversationId: string,
): Promise<void> {
  const response = await API.post(
    conversationEndpoints.unmute(accountId, conversationId),
  );

  return response.data;
}
