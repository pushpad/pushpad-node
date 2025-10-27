/**
 * Base class providing helpers shared across Pushpad API resources.
 */
export class ResourceBase {
  /**
   * @param {import('../httpClient.js').HttpClient} client
   * @param {number | undefined} defaultProjectId
   */
  constructor(client, defaultProjectId) {
    this.client = client;
    this.defaultProjectId = defaultProjectId;
  }

  /**
   * Resolves the project id to be used for a request.
   * @param {{ projectId?: number }} [options]
   * @returns {string}
   */
  requireProjectId(options) {
    const hasOverride = options && Object.prototype.hasOwnProperty.call(options, 'projectId');
    const projectId = hasOverride ? options.projectId : this.defaultProjectId;
    if (projectId === undefined || projectId === null || projectId === '') {
      throw new Error('A projectId is required. Pass it in the Pushpad constructor or the call options.');
    }
    return String(projectId);
  }

  /**
   * Ensures IDs used in paths are valid strings.
   * @param {number | string} id
   * @param {string} descriptor
   * @returns {string}
   */
  ensureId(id, descriptor) {
    if (id === undefined || id === null || id === '') {
      throw new Error(`${descriptor} is required`);
    }
    return encodeURIComponent(String(id));
  }
}

export default ResourceBase;
