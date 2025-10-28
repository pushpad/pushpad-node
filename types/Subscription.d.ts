export interface Subscription {
  id?: number;
  project_id?: number;
  endpoint?: string;
  p256dh?: string;
  auth?: string;
  uid?: string;
  tags?: string[];
  last_click_at?: string;
  created_at?: string;
}
