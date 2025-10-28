export interface Notification {
  id: number;
  project_id: number;
  title: string;
  body: string;
  target_url: string;
  icon_url: string | null;
  badge_url: string | null;
  image_url: string | null;
  ttl: number;
  require_interaction: boolean;
  silent: boolean;
  urgent: boolean;
  custom_data: string | null;
  starred: boolean;
  send_at: string | null;
  custom_metrics: string[];
  uids: string[] | null;
  tags: string[] | null;
  created_at: string;
  successfully_sent_count?: number;
  opened_count?: number;
  scheduled_count?: number;
  scheduled?: boolean;
  cancelled?: boolean;
  actions: {
    title: string;
    target_url?: string | null;
    icon?: string | null;
    action: string;
  }[];
}

export interface NotificationCreateResult {
  id: number;
  scheduled?: number;
  uids?: string[];
  send_at?: string;
}
