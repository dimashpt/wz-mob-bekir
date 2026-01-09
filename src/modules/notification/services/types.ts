export interface ListNotificationParams {
  page?: number;
  sort_order?: 'asc' | 'desc';
  includes?: Array<'read' | 'snoozed'>;
}

export interface ListNotificationResponse {
  data: {
    meta: {
      count: number;
      current_page: number;
      unread_count: number;
    };
    payload: Notification[];
  };
}

export interface Notification {}
