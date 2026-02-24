import { API } from '@/lib/axios';
import { objectToFormData } from '@/utils/data-transform';
import { conversationEndpoints } from '../../constants/endpoints';
import {
  BulkUpdateActionPayload,
  Conversation,
  ConversationDetailsResponse,
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
): Promise<ConversationDetailsResponse> {
  const response = await API.get<ConversationDetailsResponse>(
    conversationEndpoints.details(conversationId),
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
  conversationId: string,
  payload: UpdateStatusPayload,
): Promise<UpdateStatusResponse> {
  const response = await API.post<UpdateStatusResponse>(
    conversationEndpoints.updateStatus(conversationId),
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
  conversationId: string,
  payload: UpdateAssigneePayload | UpdateAssigneeTeamPayload,
): Promise<UpdateAssigneeResponse> {
  const response = await API.post<UpdateAssigneeResponse>(
    conversationEndpoints.updateAssignee(conversationId),
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
  conversationId: string,
  payload: UpdatePriorityPayload,
): Promise<UpdatePriorityResponse> {
  const response = await API.post<UpdatePriorityResponse>(
    conversationEndpoints.updatePriority(conversationId),
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
  conversationId: string,
  payload: UpdateLabelConversationPayload,
): Promise<UpdateLabelConversationResponse> {
  const response = await API.post<UpdateLabelConversationResponse>(
    conversationEndpoints.updateLabels(conversationId),
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
  conversationId: string,
  payload: UpdateParticipantsPayload,
): Promise<UpdateParticipantsResponse> {
  const response = await API.put<UpdateParticipantsResponse>(
    conversationEndpoints.participants(conversationId),
    payload,
  );

  return response.data;
}

/**
 * Bulk updates the action for the given conversations.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response.
 */
export async function bulkUpdateAction(
  payload: BulkUpdateActionPayload,
): Promise<void> {
  const response = await API.post<void>(
    conversationEndpoints.updateBulk(),
    payload,
  );

  return response.data;
}

/**
 * Unreads the given conversation.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function unreadConversation(
  conversationId: number,
): Promise<UnreadConversationResponse> {
  const response = await API.post<UnreadConversationResponse>(
    conversationEndpoints.unread(conversationId),
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
  conversationId: string,
): Promise<Conversation> {
  const response = await API.post<Conversation>(
    conversationEndpoints.updateLastSeen(conversationId),
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
  conversationId: string,
  before?: number,
): Promise<ConversationMessagesResponse> {
  const response = await API.get<ConversationMessagesResponse>(
    conversationEndpoints.messages(conversationId),
    { params: { before } },
  );

  return response.data;
}

/**
 * Lists the participants for the given conversation.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the participants.
 */
export async function listParticipants(
  conversationId: string,
): Promise<ConversationParticipantsResponse> {
  const response = await API.get<ConversationParticipantsResponse>(
    conversationEndpoints.participants(conversationId),
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
  conversationId: string,
  payload: UpdateTypingStatusPayload,
): Promise<void> {
  const response = await API.post(
    conversationEndpoints.updateTypingStatus(conversationId),
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
  conversationId: string,
  payload: SendMessagePayload,
): Promise<Message> {
  const formData = objectToFormData(payload);

  const response = await API.post(
    conversationEndpoints.sendMessage(conversationId),
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
  conversationId: string,
  messageId: number,
): Promise<Message> {
  const response = await API.delete<Message>(
    conversationEndpoints.deleteMessage(conversationId, messageId),
  );

  return response.data;
}

/**
 * Mutes the given conversation.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function muteConversation(conversationId: string): Promise<void> {
  const response = await API.post(conversationEndpoints.mute(conversationId));

  return response.data;
}

/**
 * Unmutes the given conversation.
 * @param conversationId - The ID of the conversation.
 * @returns A promise that resolves to the response.
 */
export async function unmuteConversation(
  conversationId: string,
): Promise<void> {
  const response = await API.post(conversationEndpoints.unmute(conversationId));

  return response.data;
}
