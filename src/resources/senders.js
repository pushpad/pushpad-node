import { ResourceBase } from './base.js';

/**
 * Provides access to Pushpad sender endpoints.
 */
export class SenderResource extends ResourceBase {

  /**
   * Creates a new sender.
   * @param {Record<string, unknown>} data
   * @returns {Promise<Record<string, unknown>>}
   */
  async create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Sender data must be a non-empty object.');
    }

    return this.client.request('POST', 'senders', {
      body: data,
      expectedStatuses: 201
    });
  }

  /**
   * Lists all senders.
   * @returns {Promise<unknown[]>}
   */
  async findAll() {
    return this.client.request('GET', 'senders', {
      expectedStatuses: 200
    });
  }

  /**
   * Retrieves a sender by id.
   * @param {number} senderId
   * @returns {Promise<Record<string, unknown>>}
   */
  async find(senderId) {
    const id = this.ensureId(senderId, 'senderId');
    return this.client.request('GET', `senders/${id}`, {
      expectedStatuses: 200
    });
  }

  /**
   * Updates a sender.
   * @param {number} senderId
   * @param {Record<string, unknown>} data
   * @returns {Promise<Record<string, unknown>>}
   */
  async update(senderId, data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Sender data must be a non-empty object.');
    }

    const id = this.ensureId(senderId, 'senderId');
    return this.client.request('PATCH', `senders/${id}`, {
      body: data,
      expectedStatuses: 200
    });
  }

  /**
   * Deletes a sender.
   * @param {number} senderId
   * @returns {Promise<void>}
   */
  async delete(senderId) {
    const id = this.ensureId(senderId, 'senderId');
    await this.client.request('DELETE', `senders/${id}`, {
      expectedStatuses: 204,
      expectBody: false
    });
  }
}

export default SenderResource;
