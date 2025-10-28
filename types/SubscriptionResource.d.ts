import type { Subscription } from './Subscription';
import type { RequestOptions } from './Options';

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
