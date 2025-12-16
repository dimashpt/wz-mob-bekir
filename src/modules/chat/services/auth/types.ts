export interface ChatLoginPayload {
  email: string;
  password: string;
}

export interface ChatLoginMfaRequiredResponse {
  mfa_required?: true;
  mfa_token?: string;
}

export interface ChatLoginSuccessResponse {
  data?: ChatUser;
}

export type ChatLoginResponse = ChatLoginSuccessResponse &
  ChatLoginMfaRequiredResponse;

export interface ChatAuthHeaders {
  'access-token': string;
  uid: string;
  client: string;
}

export type ChatUserRole = 'administrator' | 'agent';

export type ChatUser = {
  id: number;
  name: string;
  account_id: number;
  accounts: ChatAccount[];
  email: string;
  pubsub_token: string;
  avatar_url: string;
  available_name: string;
  role: ChatUserRole;
  identifier_hash: string;
  availability: string;
  thumbnail: string;
  availability_status: ChatAvailabilityStatus;
  type: string;
};

export type ChatAvailabilityStatus = 'online' | 'offline' | 'busy' | 'typing';

export type ChatAccount = {
  active_at: string;
  auto_offline: boolean;
  availability: string;
  availability_status: string;
  custom_role?: string;
  custom_role_id?: string;
  id: number;
  name: string;
  permissions: string[];
  role: string;
  status: string;
};
