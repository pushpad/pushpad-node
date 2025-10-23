/**
 * Custom error raised when the Pushpad API returns an unsuccessful status code.
 */
export class PushpadError extends Error {
  /**
   * @param {string} message
   * @param {{
   *   status: number,
   *   statusText?: string,
   *   body?: unknown,
   *   headers?: Record<string, string>,
   *   request?: {
   *     method: string,
   *     url: string,
   *     body?: unknown
   *   }
   * }} [meta]
   */
  constructor(message, meta = {}) {
    super(message);
    this.name = 'PushpadError';
    this.status = meta.status ?? 0;
    this.statusText = meta.statusText ?? '';
    this.body = meta.body;
    this.headers = meta.headers ?? {};
    this.request = meta.request;
  }
}

export default PushpadError;
