import { Agent } from '../agent/types';
import { Inbox } from '../inbox/types';

type ConversationStatusFilter = ConversationStatus | 'all';
type AssigneeTypeFilter = 'me' | 'unassigned' | 'all';
type SortByFilter = 'sort_on_created_at' | 'sort_on_priority' | 'latest';

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
  assignee_id: null;
  team_id: null;
  snoozed_until: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  last_message_id: string;
  contact: Contact;
  last_message: Message;
  labels: string[];
  team: null;
  inbox: Inbox;
  assignee: null;
  assignees: Agent[];
  // Upcoming feature flags
  muted?: boolean;
}

// interface Inbox {
//   id: number;
//   name: string;
//   channel_type: string;
//   settings: Settings;
//   created_at: string;
//   updated_at: string;
//   deleted_at: null;
// }

// interface Settings {
//   phone_number: string;
//   api_key: string;
//   webhook_url: null;
//   assignment_mode: string;
// }

// interface Lastmessage {
//   conversation_id: number;
//   content: string;
//   message_type: string;
//   status: string;
//   content_type: string;
//   content_attributes: any[];
//   reply_to_message_id: null;
//   updated_at: string;
//   created_at: string;
//   metadata: Metadata;
//   external_id: string;
//   id: string;
// }

// interface Metadata {
//   sent: boolean;
//   message: Message;
// }

// interface Message {
//   from_me: boolean;
//   type: string;
//   chat_id: string;
//   timestamp: number;
//   source: string;
//   device_id: number;
//   status: string;
//   text: Text;
//   from: string;
//   id: string;
// }

// interface Text {
//   body: string;
// }

// interface Contact {
//   id: number;
//   name: string;
//   phone_number: string;
//   email: string;
//   thumbnail: string;
//   additional_attributes: null;
//   created_at: string;
//   updated_at: string;
//   conversations: Conversation[];
// }

// interface Conversation {
//   id: number;
//   inbox_id: number;
//   contact_id: number;
//   status: string;
//   assignee_id: null;
//   team_id: null;
//   snoozed_until: null;
//   created_at: string;
//   updated_at: string;
//   deleted_at: null;
//   last_message_id: string;
// }

interface Meta {
  assignee: Agent;
  channel: string;
  hmac_verified: boolean;
  sender: MetaSender;
  team: Team;
}

export interface Team {
  account_id: number;
  allow_auto_assign: boolean;
  description: string;
  id: number;
  is_member: boolean;
  name: string;
}

interface MetaSender {
  additional_attributes: Customattributes;
  availability_status: string;
  created_at: number;
  custom_attributes: Customattributes;
  email: string;
  id: number;
  identifier: null;
  last_activity_at: number;
  name: string;
  phone_number: null;
  thumbnail: string;
}

interface LastNonActivityMessage {
  account_id: number;
  additional_attributes: Customattributes;
  content: string;
  content_attributes: Customattributes;
  content_type: string;
  conversation: {
    assignee_id: number;
    contact_inbox: { source_id: string };
    last_activity_at: number;
    unread_count: number;
  };
  conversation_id: number;
  created_at: number;
  external_source_ids: Customattributes;
  id: number;
  inbox_id: number;
  message_type: number;
  private: boolean;
  processed_message_content: string;
  sender: Sender;
  sender_id: number;
  sender_type: string;
  sentiment: Customattributes;
  source_id: null;
  status: string;
  updated_at: string;
  attachments?: Attachment[];
}

interface Sender {
  availability_status: string;
  available_name: string;
  avatar_url: string;
  id: number;
  name: string;
  thumbnail: string;
  type: string;
}

interface Customattributes {}

interface Additionalattributes {
  browser: Browser;
  browser_language: string;
  initiated_at: Initiatedat;
  referer: null;
}

interface Initiatedat {
  timestamp: string;
}

interface Browser {
  browser_name: string;
  browser_version: string;
  device_name: string;
  platform_name: string;
  platform_version: string;
}

interface ConversationCounter {
  all_count: number;
  assigned_count: number;
  mine_count: number;
  unassigned_count: number;
}

export interface ConversationDetailsResponse extends Conversation {}

export type ConversationStatus = 'open' | 'pending' | 'snoozed' | 'resolved';

export interface UpdateStatusPayload {
  snoozed_until?: string;
  status: ConversationStatus;
}

export interface UpdateStatusResponse {
  payload: {
    conversation_id: number;
    current_status: ConversationStatus;
    snoozed_until: string;
    success: boolean;
  };
}

export interface UpdateAssigneePayload {
  assignee_id: number;
}

export interface UpdateAssigneeTeamPayload {
  team_id: number;
}

export interface UpdateAssigneeResponse {}

export type ConversationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'
  | 'none';

export interface UpdatePriorityPayload {
  priority: ConversationPriority;
}

export interface UpdatePriorityResponse {}

export interface UpdateLabelConversationPayload {
  labels: string[];
}

export interface UpdateLabelConversationResponse {
  payload: string[];
}

export interface UpdateParticipantsPayload {
  user_ids: number[];
}

export type UpdateParticipantsResponse = Agent[];

export interface BulkUpdateActionPayload {
  ids: number[];
  type: 'Conversation';
  fields?: {
    assignee_id?: number;
    status?: ConversationStatus;
  };
  labels?: {
    add?: string[];
  };
}

export interface UnreadConversationPayload {}

export interface UnreadConversationResponse extends Conversation {}

export interface ConversationMessagesResponse {
  meta: ConversationMeta;
  payload: Message[];
}

export interface Message {
  content: string;
  content_attributes: ContentAttributes;
  content_type: string;
  conversation_id: number;
  created_at: number;
  echo_id: string; // Used for optimistic updates
  id: number;
  inbox_id: number;
  message_type: number;
  private: boolean;
  sender?: Sender;
  source_id: null;
  status: string;
  attachments?: Attachment[];
}

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

interface ContentAttributes {
  in_reply_to?: number;
  submitted_email?: string;
  deleted?: boolean;
}

export interface ConversationMeta {
  additional_attributes: Additionalattributes;
  agent_last_seen_at: string;
  assignee: Agent;
  assignee_last_seen_at: string;
  contact: Contact;
  labels: string[];
}

interface Contact {
  additional_attributes: Customattributes;
  custom_attributes: Customattributes;
  email: string;
  id: number;
  identifier: null;
  name: string;
  phone_number: null;
  thumbnail: string;
  type: string;
}

interface Customattributes {}

interface Initiatedat {
  timestamp: string;
}

interface Browser {
  browser_name: string;
  browser_version: string;
  device_name: string;
  platform_name: string;
  platform_version: string;
}

export type ConversationParticipantsResponse = Agent[];

export interface UpdateTypingStatusPayload {
  is_private: boolean;
  typing_status: 'off' | 'on';
}

export interface SendMessagePayload {
  attachments?: {
    uri: string;
    type?: string;
    name?: string;
  }[];
  content: string;
  content_attributes: ContentAttributes;
  echo_id: string;
  private: boolean;
  cc_emails?: string[];
  bcc_emails?: string[];
}

export interface CustomAttribute {
  id: number;
  attributeDisplayName: string;
  attributeDisplayType: string;
  attributeDescription: string;
  attributeKey: string;
  regexPattern: string;
  regexCue: string;
  attributeValues: string[];
  attributeModel: string;
  defaultValue: string;
  createdAt: string;
  updatedAt: string;
  value: string;
}
