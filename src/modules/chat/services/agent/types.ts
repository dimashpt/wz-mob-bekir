export interface ConversationAssignableAgentsParams {
  inbox_ids: number[] | string[];
}

export interface ConversationAssignableAgentsResponse {
  payload: Agent[];
}

export interface Agent {
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
