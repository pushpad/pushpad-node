export interface NotificationAction {
  title?: string;
  target_url?: string;
  icon?: string;
  action?: string;
}

export interface Notification {
  id?: number;
  project_id?: number;
  title?: string;
  body?: string;
  target_url?: string;
  icon_url?: string;
  badge_url?: string;
  image_url?: string;
  ttl?: number;
  require_interaction?: boolean;
  silent?: boolean;
  urgent?: boolean;
  custom_data?: string;
  actions?: NotificationAction[];
  starred?: boolean;
  send_at?: string;
  custom_metrics?: string[];
  uids?: string[];
  tags?: string[];
  created_at?: string;
  successfully_sent_count?: number;
  opened_count?: number;
  scheduled_count?: number;
  scheduled?: boolean;
  cancelled?: boolean;
}

export interface NotificationCreateResult {
  id: number;
  scheduled?: number;
  uids?: string[];
  send_at?: string;
}
