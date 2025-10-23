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
  custom_data?: Record<string, unknown>;
  send_at?: string;
  click_url?: string;
  custom_metrics?: unknown;
  created_at?: string;
  [key: string]: unknown;
}

export interface NotificationCreateInput extends Omit<Notification, 'id' | 'project_id' | 'created_at'> {
  body: string;
}

export interface NotificationCreateResult {
  id: number;
  scheduled?: number;
  uids?: string[];
  send_at?: string;
  [key: string]: unknown;
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
  last_click_at?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface SubscriptionCreateInput extends Omit<Subscription, 'id' | 'project_id' | 'last_click_at' | 'created_at'> {
  endpoint: string;
}

export interface SubscriptionUpdateInput extends Partial<SubscriptionCreateInput> {}

export interface SubscriptionListQuery {
  page?: number;
  per_page?: number;
  perPage?: number;
  uids?: string | string[];
  tags?: string | string[];
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
  [key: string]: unknown;
}

export interface ProjectCreateInput extends Required<Pick<Project, 'sender_id' | 'name' | 'website'>>,
  Omit<Project, 'id' | 'created_at'> {}

export interface ProjectUpdateInput extends Partial<ProjectCreateInput> {}

export interface Sender {
  id?: number;
  name?: string;
  vapid_private_key?: string;
  vapid_public_key?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface SenderCreateInput extends Required<Pick<Sender, 'name'>>,
  Omit<Sender, 'id' | 'created_at'> {}

export interface SenderUpdateInput extends Partial<SenderCreateInput> {}

export interface RequestOptions {
  projectId?: number | string;
}

export interface PushpadOptions {
  authToken: string;
  projectId?: number | string;
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
}

export class NotificationResource {
  create(data: NotificationCreateInput, options?: RequestOptions): Promise<NotificationCreateResult>;
  findAll(query?: NotificationListQuery, options?: RequestOptions): Promise<Notification[]>;
  find(notificationId: number | string): Promise<Notification>;
  cancel(notificationId: number | string): Promise<void>;
}

export class SubscriptionResource {
  create(data: SubscriptionCreateInput, options?: RequestOptions): Promise<Subscription>;
  findAll(query?: SubscriptionListQuery, options?: RequestOptions): Promise<Subscription[]>;
  find(subscriptionId: number | string, options?: RequestOptions): Promise<Subscription>;
  update(subscriptionId: number | string, data: SubscriptionUpdateInput, options?: RequestOptions): Promise<Subscription>;
  delete(subscriptionId: number | string, options?: RequestOptions): Promise<void>;
}

export class ProjectResource {
  create(data: ProjectCreateInput): Promise<Project>;
  findAll(): Promise<Project[]>;
  find(projectId: number | string): Promise<Project>;
  update(projectId: number | string, data: ProjectUpdateInput): Promise<Project>;
  delete(projectId: number | string): Promise<void>;
}

export class SenderResource {
  create(data: SenderCreateInput): Promise<Sender>;
  findAll(): Promise<Sender[]>;
  find(senderId: number | string): Promise<Sender>;
  update(senderId: number | string, data: SenderUpdateInput): Promise<Sender>;
  delete(senderId: number | string): Promise<void>;
}

export class Pushpad {
  constructor(options: PushpadOptions);
  notification: NotificationResource;
  subscription: SubscriptionResource;
  project: ProjectResource;
  sender: SenderResource;
  get projectId(): number | string | undefined;
  setProjectId(projectId?: number | string): void;
}

export class PushpadError extends Error {
  status: number;
  statusText: string;
  body?: unknown;
  headers?: Record<string, string>;
  request?: {
    method: string;
    url: string;
    body?: unknown;
  };
}

export default Pushpad;
