import { ResourceBase } from './base.js';

/**
 * Provides access to Pushpad project endpoints.
 */
export class ProjectResource extends ResourceBase {

  /**
   * Creates a new project.
   * @param {Record<string, unknown>} data
   * @returns {Promise<Record<string, unknown>>}
   */
  async create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Project data must be a non-empty object.');
    }

    return this.client.request('POST', 'projects', {
      body: data,
      expectedStatuses: 201
    });
  }

  /**
   * Lists all projects.
   * @returns {Promise<unknown[]>}
   */
  async findAll() {
    return this.client.request('GET', 'projects', {
      expectedStatuses: 200
    });
  }

  /**
   * Retrieves a project by id.
   * @param {number} projectId
   * @returns {Promise<Record<string, unknown>>}
   */
  async find(projectId) {
    const id = this.ensureId(projectId, 'projectId');
    return this.client.request('GET', `projects/${id}`, {
      expectedStatuses: 200
    });
  }

  /**
   * Updates a project.
   * @param {number} projectId
   * @param {Record<string, unknown>} data
   * @returns {Promise<Record<string, unknown>>}
   */
  async update(projectId, data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Project data must be a non-empty object.');
    }

    const id = this.ensureId(projectId, 'projectId');
    return this.client.request('PATCH', `projects/${id}`, {
      body: data,
      expectedStatuses: 200
    });
  }

  /**
   * Deletes a project.
   * @param {number} projectId
   * @returns {Promise<void>}
   */
  async delete(projectId) {
    const id = this.ensureId(projectId, 'projectId');
    await this.client.request('DELETE', `projects/${id}`, {
      expectedStatuses: 202,
      expectBody: false
    });
  }
}

export default ProjectResource;
