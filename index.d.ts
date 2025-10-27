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

export interface NotificationCreateInput extends Omit<
  Notification,
  'id' | 'project_id' | 'created_at' | 'successfully_sent_count' | 'opened_count' | 'scheduled_count' | 'scheduled' | 'cancelled'
> {
  body: string;
}

export interface NotificationCreateResult {
  id: number;
  scheduled?: number;
  uids?: string[];
  send_at?: string;
}

export interface NotificationListQuery {
  page?: number;
}

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

export interface SubscriptionCreateInput extends Omit<Subscription, 'id' | 'project_id' | 'last_click_at' | 'created_at'> {
  endpoint: string;
}

export interface SubscriptionUpdateInput extends Partial<
  Omit<SubscriptionCreateInput, 'endpoint' | 'p256dh' | 'auth'>
> {}

export interface SubscriptionListQuery {
  page?: number;
  per_page?: number;
  uids?: string[];
  tags?: string[];
}

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

export interface ProjectCreateInput extends Required<Pick<Project, 'sender_id' | 'name' | 'website'>>,
  Omit<Project, 'id' | 'created_at'> {}

export interface ProjectUpdateInput extends Partial<Omit<ProjectCreateInput, 'sender_id'>> {}

export interface Sender {
  id?: number;
  name?: string;
  vapid_private_key?: string;
  vapid_public_key?: string;
  created_at?: string;
}

export interface SenderCreateInput extends Required<Pick<Sender, 'name'>>,
  Omit<Sender, 'id' | 'created_at'> {}

export interface SenderUpdateInput extends Partial<
  Omit<SenderCreateInput, 'vapid_private_key' | 'vapid_public_key'>
> {}

export interface RequestOptions {
  projectId?: number;
}

export interface PushpadOptions {
  authToken: string;
  projectId?: number;
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
}

export class NotificationResource {
  create(data: NotificationCreateInput, options?: RequestOptions): Promise<NotificationCreateResult>;
  findAll(query?: NotificationListQuery, options?: RequestOptions): Promise<Notification[]>;
  find(notificationId: number): Promise<Notification>;
  cancel(notificationId: number): Promise<void>;
}

export class SubscriptionResource {
  create(data: SubscriptionCreateInput, options?: RequestOptions): Promise<Subscription>;
  findAll(query?: SubscriptionListQuery, options?: RequestOptions): Promise<Subscription[]>;
  find(subscriptionId: number, options?: RequestOptions): Promise<Subscription>;
  update(subscriptionId: number, data: SubscriptionUpdateInput, options?: RequestOptions): Promise<Subscription>;
  delete(subscriptionId: number, options?: RequestOptions): Promise<void>;
}

export class ProjectResource {
  create(data: ProjectCreateInput): Promise<Project>;
  findAll(): Promise<Project[]>;
  find(projectId: number): Promise<Project>;
  update(projectId: number, data: ProjectUpdateInput): Promise<Project>;
  delete(projectId: number): Promise<void>;
}

export class SenderResource {
  create(data: SenderCreateInput): Promise<Sender>;
  findAll(): Promise<Sender[]>;
  find(senderId: number): Promise<Sender>;
  update(senderId: number, data: SenderUpdateInput): Promise<Sender>;
  delete(senderId: number): Promise<void>;
}

export class Pushpad {
  constructor(options: PushpadOptions);
  notification: NotificationResource;
  subscription: SubscriptionResource;
  project: ProjectResource;
  sender: SenderResource;
}

export class PushpadError extends Error {
  status: number;
  statusText?: string;
  body?: unknown;
  headers?: Record<string, string>;
  request?: {
    method: string;
    url: string;
    body?: unknown;
  };
}

export default Pushpad;
