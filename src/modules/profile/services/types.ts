export interface ProfileResponse {
  user: User;
  tenant: {
    id: string;
    name: string;
    plan: string;
    logo: string;
  };
  permissions: UserPermission[];
  roles: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  newsletter: boolean;
  global_role: boolean;
  tenant_id: string;
  avatar: string | null;
  status: string;
  role: number;
  role_name: string;
  assigned_stores: unknown[];
  permissions: UserPermission[];
}

export interface UserPermission {
  guard_name: string;
  permission_id: number;
  permission_name: string;
  role_id: number;
  role_name: string;
}

export interface ChatProfileResponse {
  access_token: string;
  account_id: number;
  accounts: Account[];
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
  ui_settings: UiSettings;
  uid: string;
}

interface UiSettings {
  is_contact_attributes_open: boolean;
  is_contact_sidebar_open: boolean;
  is_conv_actions_open: boolean;
  is_conv_details_open: boolean;
  is_conv_participants_open: boolean;
  is_ct_custom_attr_open: boolean;
  is_macro_open: boolean;
  is_open_ai_cta_modal_dismissed: boolean;
  is_previous_conv_open: boolean;
  last_active_locale_code: string;
  last_active_portal_slug: string;
  previously_used_sidebar_view: boolean;
  rtl_view: boolean;
  show_secondary_sidebar: boolean;
}

interface Account {
  active_at: string;
  auto_offline: boolean;
  availability: string;
  availability_status: string;
  id: number;
  name: string;
  permissions: string[];
  role: string;
  status: string;
}

export interface AvailabilityResponse extends ChatProfileResponse {}
