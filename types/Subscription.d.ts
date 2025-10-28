export interface Subscription {
  id: number;
  project_id: number;
  endpoint: string;
  p256dh: string | null;
  auth: string | null;
  uid: string | null;
  tags: string[];
  last_click_at: string | null;
  created_at: string;
}
