export interface ConversationMessagesResponse {
  meta: Meta;
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
}

interface Sender {
  additional_attributes?: Customattributes;
  custom_attributes?: Customattributes;
  email?: string;
  id: number;
  identifier?: null;
  name: string;
  phone_number?: null;
  thumbnail: string;
  type: string;
  availability_status?: string;
  available_name?: string;
  avatar_url?: string;
}

interface ContentAttributes {
  in_reply_to?: null;
  submitted_email?: string;
}

interface Meta {
  additional_attributes: Additionalattributes;
  agent_last_seen_at: string;
  assignee: Assignee;
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

interface Assignee {
  availability_status: string;
  available_name: string;
  avatar_url: string;
  id: number;
  name: string;
  thumbnail: string;
  type: string;
}

interface Additionalattributes {
  browser: Browser;
  browser_language: string;
  initiated_at: Initiatedat;
  referer: string;
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

export interface ConversationParticipantsResponse {}

export interface ConversationMacrosResponse {}

export interface ConversationTeamsResponse {}

export interface ConversationAssignableAgentsParams {
  inbox_ids: number[] | string[];
}

export interface ConversationAssignableAgentsResponse {}

export interface UpdateTypingStatusPayload {
  is_private: boolean;
  typing_status: 'off' | 'on';
}

export interface SendMessagePayload {
  content: string;
  content_attributes: ContentAttributes;
  echo_id: string;
  private: boolean;
}
