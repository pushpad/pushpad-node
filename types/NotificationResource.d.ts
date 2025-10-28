import type { Notification, NotificationCreateResult } from './Notification';
import type { RequestOptions } from './Options';

export interface NotificationCreateInput extends Omit<
  Notification,
  'id' | 'project_id' | 'created_at' | 'successfully_sent_count' | 'opened_count' | 'scheduled_count' | 'scheduled' | 'cancelled'
> {
  body: string;
}

export interface NotificationListQuery {
  page?: number;
}

export class NotificationResource {
  create(data: NotificationCreateInput, options?: RequestOptions): Promise<NotificationCreateResult>;
  findAll(query?: NotificationListQuery, options?: RequestOptions): Promise<Notification[]>;
  find(notificationId: number): Promise<Notification>;
  cancel(notificationId: number): Promise<void>;
}
