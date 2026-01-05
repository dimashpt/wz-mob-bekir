import { Agent } from '../conversation-room/types';

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
  data: {
    meta: ConversationCounter;
    payload: Conversation[];
  };
}

export interface Conversation {
  account_id: number;
  additional_attributes: Additionalattributes;
  agent_last_seen_at: number;
  assignee_last_seen_at: number;
  can_reply: boolean;
  contact_last_seen_at: number;
  created_at: number;
  custom_attributes: Customattributes;
  first_reply_created_at: number;
  id: number;
  inbox_id: number;
  labels: string[];
  last_activity_at: number;
  last_non_activity_message: LastNonActivityMessage;
  messages: LastNonActivityMessage[];
  meta: Meta;
  muted: boolean;
  priority: null | 'low' | 'medium' | 'high' | 'urgent' | 'none';
  sla_policy_id: null;
  snoozed_until: null;
  status: string;
  timestamp: number;
  unread_count: number;
  uuid: string;
  waiting_since: number;
}

interface Meta {
  assignee: Assignee;
  channel: string;
  hmac_verified: boolean;
  sender: Sender2;
  team: Team;
}

interface Team {
  account_id: number;
  allow_auto_assign: boolean;
  description: string;
  id: number;
  is_member: boolean;
  name: string;
}

interface Sender2 {
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

interface Assignee {
  account_id: number;
  auto_offline: boolean;
  availability_status: string;
  available_name: string;
  confirmed: boolean;
  email: string;
  id: number;
  name: string;
  role: string;
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

export interface LabelListResponse {
  payload: Label[];
}

export interface Label {
  color: string;
  description: string;
  id: number;
  show_on_sidebar: boolean;
  title: string;
}

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
