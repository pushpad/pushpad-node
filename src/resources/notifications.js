import { ResourceBase } from './base.js';

/**
 * Provides access to Pushpad notification endpoints.
 */
export class NotificationResource extends ResourceBase {
  /**
   * Creates and sends a new notification.
   * @param {Record<string, unknown>} data
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<Record<string, unknown>>}
   */
  async create(data, options) {
    if (!data || typeof data !== 'object') {
      throw new Error('Notification data must be a non-empty object.');
    }

    const projectId = this.requireProjectId(options);
    return this.client.request('POST', `projects/${projectId}/notifications`, {
      body: data,
      expectedStatuses: 201
    });
  }

  /**
   * Lists notifications for a project.
   * @param {{ page?: number }} [query]
   * @param {{ projectId?: number }} [options]
   * @returns {Promise<unknown[]>}
   */
  async findAll(query, options) {
    const projectId = this.requireProjectId(options);
    return this.client.request('GET', `projects/${projectId}/notifications`, {
      query,
      expectedStatuses: 200
    });
  }

  /**
   * Retrieves a single notification.
   * @param {number} notificationId
   * @returns {Promise<Record<string, unknown>>}
   */
  async find(notificationId) {
    const id = this.ensureId(notificationId, 'notificationId');
    return this.client.request('GET', `notifications/${id}`, {
      expectedStatuses: 200
    });
  }

  /**
   * Cancels a scheduled notification.
   * @param {number} notificationId
   * @returns {Promise<void>}
   */
  async cancel(notificationId) {
    const id = this.ensureId(notificationId, 'notificationId');
    await this.client.request('DELETE', `notifications/${id}/cancel`, {
      expectedStatuses: 204,
      expectBody: false
    });
  }
}

export default NotificationResource;
