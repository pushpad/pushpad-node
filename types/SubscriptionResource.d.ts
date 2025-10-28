import type { Subscription } from './Subscription';
import type { RequestOptions } from './Options';

export interface SubscriptionCreateInput extends Omit<
  Subscription,
  'id' | 'project_id' | 'last_click_at' | 'created_at'
> {
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

export class SubscriptionResource {
  create(data: SubscriptionCreateInput, options?: RequestOptions): Promise<Subscription>;
  findAll(query?: SubscriptionListQuery, options?: RequestOptions): Promise<Subscription[]>;
  count(query?: Pick<SubscriptionListQuery, 'uids' | 'tags'>, options?: RequestOptions): Promise<number>;
  find(subscriptionId: number, options?: RequestOptions): Promise<Subscription>;
  update(subscriptionId: number, data: SubscriptionUpdateInput, options?: RequestOptions): Promise<Subscription>;
  delete(subscriptionId: number, options?: RequestOptions): Promise<void>;
}
