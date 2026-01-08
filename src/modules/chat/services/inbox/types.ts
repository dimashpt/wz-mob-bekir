export interface InboxListResponse {
  payload: Inbox[];
}

interface Inbox {
  allow_messages_after_resolved: boolean;
  auto_assignment_config: {};
  avatar_url: string;
  business_name: string;
  callback_webhook_url: string | null;
  channel_id: number;
  channel_type: string;
  continuity_via_email: boolean;
  csat_survey_enabled: boolean;
  enable_auto_assignment: boolean;
  enable_email_collect: boolean;
  greeting_enabled: boolean;
  greeting_message: string;
  hmac_mandatory: boolean;
  hmac_token: string;
  id: number;
  lock_to_single_conversation: boolean;
  messaging_service_sid: string | null;
  name: string;
  out_of_office_message: string | null;
  phone_number: string | null;
  pre_chat_form_enabled: boolean;
  pre_chat_form_options: Prechatformoptions;
  provider: string | null;
  reply_time: string;
  selected_feature_flags: string[];
  sender_name_type: string;
  timezone: string;
  web_widget_script: string;
  website_token: string;
  website_url: string;
  welcome_tagline: string;
  welcome_title: string;
  widget_color: string;
  working_hours: Workinghour[];
  working_hours_enabled: boolean;
}

interface Workinghour {
  close_hour: number | null;
  close_minutes: number | null;
  closed_all_day: boolean;
  day_of_week: number;
  open_all_day: boolean;
  open_hour: number | null;
  open_minutes: number | null;
}

interface Prechatformoptions {
  pre_chat_fields: PrechatField[];
  pre_chat_message: string;
}

interface PrechatField {
  enabled: boolean;
  field_type: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
}
