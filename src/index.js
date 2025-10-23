import HttpClient from './httpClient.js';
import { PushpadError } from './errors.js';
import { NotificationResource } from './resources/notifications.js';
import { SubscriptionResource } from './resources/subscriptions.js';
import { ProjectResource } from './resources/projects.js';
import { SenderResource } from './resources/senders.js';

/**
 * @typedef {object} PushpadOptions
 * @property {string} authToken
 * @property {number | string} [projectId]
 * @property {string} [baseUrl]
 * @property {typeof fetch} [fetch]
 * @property {number} [timeout]
 */

/**
 * Entry point for interacting with the Pushpad API.
 */
export class Pushpad {
  /**
   * @param {PushpadOptions} options
   */
  constructor(options) {
    if (!options || typeof options !== 'object') {
      throw new Error('Pushpad requires an options object.');
    }

    const { authToken, projectId, baseUrl, fetch, timeout } = options;

    if (!authToken) {
      throw new Error('authToken is required to initialise Pushpad.');
    }

    this._defaultProjectId = projectId ?? undefined;

    this.client = new HttpClient({ authToken, baseUrl, fetch, timeout });

    const getProjectId = (opts) => {
      if (opts && Object.prototype.hasOwnProperty.call(opts, 'projectId')) {
        return opts.projectId;
      }
      return this._defaultProjectId;
    };

    this.notification = new NotificationResource(this.client, getProjectId);
    this.subscription = new SubscriptionResource(this.client, getProjectId);
    this.project = new ProjectResource(this.client, getProjectId);
    this.sender = new SenderResource(this.client, getProjectId);
  }

}

export { PushpadError };
export default Pushpad;
