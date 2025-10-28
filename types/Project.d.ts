export interface Project {
  id?: number;
  sender_id?: number;
  name?: string;
  website?: string;
  icon_url?: string;
  badge_url?: string;
  notifications_ttl?: number;
  notifications_require_interaction?: boolean;
  notifications_silent?: boolean;
  created_at?: string;
}
