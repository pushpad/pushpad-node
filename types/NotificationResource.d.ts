import type {
  Notification,
  NotificationCreateResult,
} from './Notification';
import type { RequestOptions } from './Options';

export interface NotificationCreateParams {
  body: string;
  title?: string;
  target_url?: string;
  icon_url?: string;
  badge_url?: string;
  image_url?: string;
  ttl?: number;
  require_interaction?: boolean;
  silent?: boolean;
  urgent?: boolean;
  custom_data?: string;
  starred?: boolean;
  send_at?: string;
  custom_metrics?: string[];
  uids?: string[];
  tags?: string[];
  actions?: {
    title: string;
    target_url?: string;
    icon?: string;
    action?: string;
  }[];
}

export interface NotificationListParams {
  page?: number;
}

export class NotificationResource {
  create(data: NotificationCreateParams, options?: RequestOptions): Promise<NotificationCreateResult>;
  findAll(query?: NotificationListParams, options?: RequestOptions): Promise<Notification[]>;
  find(notificationId: number): Promise<Notification>;
  cancel(notificationId: number): Promise<void>;
}
