import type { Subscription } from './Subscription';
import type { RequestOptions } from './Options';

export interface SubscriptionCreateParams extends Omit<
  Subscription,
  'id' | 'project_id' | 'last_click_at' | 'created_at'
> {
  endpoint: string;
}

export interface SubscriptionUpdateParams extends Partial<
  Omit<SubscriptionCreateParams, 'endpoint' | 'p256dh' | 'auth'>
> {}

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
