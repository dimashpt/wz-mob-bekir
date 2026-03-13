import { Agent } from '../agent/types';
import { Inbox } from '../inbox/types';

export type ConversationStatus = 'open' | 'pending' | 'snoozed' | 'resolved';
type ConversationStatusFilter = ConversationStatus | 'all';
type AssigneeTypeFilter = 'me' | 'unassigned' | 'all';
type SortByFilter = 'sort_on_created_at' | 'sort_on_priority' | 'latest';
type MessageType =
  | 'incoming'
  | 'outgoing'
  | 'private'
  | 'activity'
  | 'template';

export interface ListConversationsParams {
  assignee_type?: AssigneeTypeFilter;
  status?: ConversationStatusFilter;
  page?: number;
  sort_by?: SortByFilter;
  inbox_id?: string;
}

export interface ListConversationsResponse {
  data: Conversation[];
}

export interface Conversation {
  id: number;
  inbox_id: number;
  contact_id: number;
  status: string;
  assignee_id: string;
  team_id: string;
  snoozed_until: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  last_message_id: string;
  contact: Contact;
  last_message: Message;
  labels: string[];
  team: string;
  inbox: Inbox;
  assignee: string;
  assignees: Agent[];
}

export interface Message {
  conversation_id: number;
  content: string;
  message_type: MessageType;
  status: string;
  content_type: string;
  content_attributes: string[];
  reply_to: string;
  reply_to_message_id: string;
  updated_at: string;
  created_at: string;
  metadata: Metadata;
  external_id: string;
  id: string;
  echo_id: string;
  attachment: Attachment[];
}

interface Metadata {
  sent: boolean;
  message: MetadataMessage;
}

interface MetadataMessage {
  from_me: boolean;
  type: string;
  chat_id: string;
  timestamp: number;
  source: string;
  device_id: number;
  status: string;
  text: Text;
  from: string;
  id: string;
}

interface Text {
  body: string;
}

interface Contact {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  thumbnail: string;
  additional_attributes: null;
  created_at: string;
  updated_at: string;
  conversations: ContactConversation[];
}

interface ContactConversation {
  id: number;
  inbox_id: number;
  contact_id: number;
  status: string;
  assignee_id: null;
  team_id: null;
  snoozed_until: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  last_message_id: string;
}

export type ConversationDetailsResponse = {
  data: {
    contact: Contact;
    conversation: Conversation;
    messages: Message[];
  };
};

export interface Attachment {
  account_id: number;
  data_url: string;
  extension: string | null;
  file_size: number;
  file_type: 'image' | 'file';
  height: number | null;
  id: number;
  message_id: number;
  thumb_url: string;
  width: number | null;
}

export interface UpdateLabelConversationPayload {
  labels: string[];
}

export interface UpdateLabelConversationResponse {
  payload: string[];
}
