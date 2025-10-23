/**
 * Base class providing helpers shared across Pushpad API resources.
 */
export class ResourceBase {
  /**
   * @param {import('../httpClient.js').HttpClient} client
   * @param {(options?: { projectId?: number | string }) => (number | string | undefined)} getProjectId
   */
  constructor(client, getProjectId) {
    this.client = client;
    this.getProjectId = getProjectId;
  }

  /**
   * Resolves the project id to be used for a request.
   * @param {{ projectId?: number | string }} [options]
   * @returns {string}
   */
  requireProjectId(options) {
    const projectId = this.getProjectId?.(options);
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
