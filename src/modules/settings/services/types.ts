export interface ListNotificationSettingsResponse {
  account_id: number;
  all_email_flags: boolean;
  all_push_flags: boolean;
  id: number;
  selected_email_flags: string[];
  selected_push_flags: string[];
  user_id: number;
}

export interface UpdateNotificationSettingsPayload {
  notification_settings: {
    selected_email_flags: string[];
    selected_push_flags: string[];
  };
}

export interface UpdateNotificationSettingsResponse {}
