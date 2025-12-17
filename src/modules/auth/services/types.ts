import { User, UserPermission } from '@/modules/profile/services/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
  expires_in: number;
  roles: string;
  tenant: {
    id: string;
    logo: string;
    name: string;
    plan: string;
  };
  permissions: UserPermission[];
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

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

export interface ChatLoginResponse
  extends ChatLoginSuccessResponse, ChatLoginMfaRequiredResponse {
  headers: ChatAuthHeaders;
}

export interface ChatAuthHeaders {
  'access-token': string;
  uid: string;
  client: string;
}

export type ChatUserRole = 'administrator' | 'agent';

export interface ChatUser {
  access_token: string;
  account_id: number;
  accounts: ChatAccount[];
  available_name: string;
  avatar_url: string;
  confirmed: boolean;
  display_name: null;
  email: string;
  id: number;
  inviter_id: null;
  message_signature: null;
  name: string;
  permissions: string[];
  provider: string;
  pubsub_token: string;
  role: string;
  type: string;
  ui_settings: Uisettings;
  uid: string;
}

interface Uisettings {
  is_contact_attributes_open: boolean;
  is_contact_sidebar_open: boolean;
  is_conv_actions_open: boolean;
  is_conv_details_open: boolean;
  is_conv_participants_open: boolean;
  is_macro_open: boolean;
  is_open_ai_cta_modal_dismissed: boolean;
  is_previous_conv_open: boolean;
  last_active_locale_code: string;
  last_active_portal_slug: string;
  previously_used_sidebar_view: boolean;
  rtl_view: boolean;
  show_secondary_sidebar: boolean;
}

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
