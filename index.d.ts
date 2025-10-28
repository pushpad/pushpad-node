export interface PushpadOptions {
  authToken: string;
  projectId?: number;
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
}

export interface RequestOptions {
  projectId?: number;
}

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

export interface SubscriptionCreateParams {
  endpoint: string;
  p256dh?: string;
  auth?: string;
  uid?: string;
  tags?: string[];
}

export interface SubscriptionUpdateParams {
  uid?: string;
  tags?: string[];
}

export interface SubscriptionListParams {
  page?: number;
  per_page?: number;
  uids?: string[];
  tags?: string[];
}

export class SubscriptionResource {
  create(data: SubscriptionCreateParams, options?: RequestOptions): Promise<Subscription>;
  findAll(query?: SubscriptionListParams, options?: RequestOptions): Promise<Subscription[]>;
  count(query?: Pick<SubscriptionListParams, 'uids' | 'tags'>, options?: RequestOptions): Promise<number>;
  find(subscriptionId: number, options?: RequestOptions): Promise<Subscription>;
  update(subscriptionId: number, data: SubscriptionUpdateParams, options?: RequestOptions): Promise<Subscription>;
  delete(subscriptionId: number, options?: RequestOptions): Promise<void>;
}

export interface Project {
  id: number;
  sender_id: number;
  name: string;
  website: string;
  icon_url: string | null;
  badge_url: string | null;
  notifications_ttl: number;
  notifications_require_interaction: boolean;
  notifications_silent: boolean;
  created_at: string;
}

export interface ProjectCreateParams {
  sender_id: number;
  name: string;
  website: string;
  icon_url?: string;
  badge_url?: string;
  notifications_ttl?: number;
  notifications_require_interaction?: boolean;
  notifications_silent?: boolean;
}

export interface ProjectUpdateParams {
  name?: string;
  website?: string;
  icon_url?: string;
  badge_url?: string;
  notifications_ttl?: number;
  notifications_require_interaction?: boolean;
  notifications_silent?: boolean;
}

export class ProjectResource {
  create(data: ProjectCreateParams): Promise<Project>;
  findAll(): Promise<Project[]>;
  find(projectId: number): Promise<Project>;
  update(projectId: number, data: ProjectUpdateParams): Promise<Project>;
  delete(projectId: number): Promise<void>;
}

export interface Sender {
  id: number;
  name: string;
  vapid_private_key: string;
  vapid_public_key: string;
  created_at: string;
}

export interface SenderCreateParams {
  name: string;
  vapid_private_key?: string;
  vapid_public_key?: string;
}

export interface SenderUpdateParams {
  name?: string;
}

export class SenderResource {
  create(data: SenderCreateParams): Promise<Sender>;
  findAll(): Promise<Sender[]>;
  find(senderId: number): Promise<Sender>;
  update(senderId: number, data: SenderUpdateParams): Promise<Sender>;
  delete(senderId: number): Promise<void>;
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

declare class Pushpad {
  constructor(options: PushpadOptions);
  notification: NotificationResource;
  subscription: SubscriptionResource;
  project: ProjectResource;
  sender: SenderResource;
  signatureFor(data: string): string;
}

export default Pushpad;
export { Pushpad };
