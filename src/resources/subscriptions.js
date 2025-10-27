import { ResourceBase } from './base.js';

function normalizeQuery(query) {
  if (!query) return undefined;

  const normalized = {};

  if (query.page !== undefined) {
    normalized.page = query.page;
  }

  if (query.per_page !== undefined) {
    normalized.per_page = query.per_page;
  } else if (query.perPage !== undefined) {
    normalized.per_page = query.perPage;
  }

  if (query.uids !== undefined) {
    normalized['uids[]'] = Array.isArray(query.uids) ? query.uids : [query.uids];
  }

  if (query.tags !== undefined) {
    normalized['tags[]'] = Array.isArray(query.tags) ? query.tags : [query.tags];
  }

  return normalized;
}

/**
 * Provides access to Pushpad subscription endpoints.
 */
export class SubscriptionResource extends ResourceBase {
  /**
   * Creates a new subscription.
   * @param {Record<string, unknown>} data
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<Record<string, unknown>>}
   */
  async create(data, options) {
    if (!data || typeof data !== 'object') {
      throw new Error('Subscription data must be a non-empty object.');
    }

    const projectId = this.requireProjectId(options);
    return this.client.request('POST', `projects/${projectId}/subscriptions`, {
      body: data,
      expectedStatuses: 201
    });
  }

  /**
   * Lists subscriptions for a project.
   * @param {{
   *   page?: number,
   *   per_page?: number,
   *   perPage?: number,
   *   uids?: string | string[],
   *   tags?: string | string[]
   * }} [query]
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<unknown[]>}
   */
  async findAll(query, options) {
    const projectId = this.requireProjectId(options);
    return this.client.request('GET', `projects/${projectId}/subscriptions`, {
      query: normalizeQuery(query),
      expectedStatuses: 200
    });
  }

  /**
   * Retrieves a single subscription.
   * @param {number} subscriptionId
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<Record<string, unknown>>}
   */
  async find(subscriptionId, options) {
    const projectId = this.requireProjectId(options);
    const id = this.ensureId(subscriptionId, 'subscriptionId');
    return this.client.request('GET', `projects/${projectId}/subscriptions/${id}`, {
      expectedStatuses: 200
    });
  }

  /**
   * Updates an existing subscription.
   * @param {number} subscriptionId
   * @param {Record<string, unknown>} data
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<Record<string, unknown>>}
   */
  async update(subscriptionId, data, options) {
    if (!data || typeof data !== 'object') {
      throw new Error('Subscription data must be a non-empty object.');
    }

    const projectId = this.requireProjectId(options);
    const id = this.ensureId(subscriptionId, 'subscriptionId');
    return this.client.request('PATCH', `projects/${projectId}/subscriptions/${id}`, {
      body: data,
      expectedStatuses: 200
    });
  }

  /**
   * Deletes a subscription.
   * @param {number} subscriptionId
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<void>}
   */
  async delete(subscriptionId, options) {
    const projectId = this.requireProjectId(options);
    const id = this.ensureId(subscriptionId, 'subscriptionId');
    await this.client.request('DELETE', `projects/${projectId}/subscriptions/${id}`, {
      expectedStatuses: 204,
      expectBody: false
    });
  }
}

export default SubscriptionResource;
