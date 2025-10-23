import { PushpadError } from './errors.js';

const DEFAULT_BASE_URL = 'https://pushpad.xyz/api/v1';

/**
 * @param {typeof fetch | undefined} customFetch
 * @returns {typeof fetch}
 */
function resolveFetch(customFetch) {
  if (typeof customFetch === 'function') {
    return customFetch;
  }

  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis);
  }

  throw new Error('A fetch implementation is required. Provide one through the Pushpad constructor options.');
}

/**
 * Converts a query object into URLSearchParams, supporting array values.
 * @param {Record<string, unknown> | undefined} query
 * @returns {URLSearchParams | undefined}
 */
function buildQueryParams(query) {
  if (!query || Object.keys(query).length === 0) {
    return undefined;
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry === undefined || entry === null) continue;
        params.append(key, String(entry));
      }
      continue;
    }

    params.append(key, String(value));
  }

  return params;
}

/**
 * @typedef {object} HttpClientRequestOptions
 * @property {Record<string, unknown>} [query]
 * @property {unknown} [body]
 * @property {Record<string, string>} [headers]
 * @property {number | number[]} [expectedStatuses]
 * @property {boolean} [expectBody]
 */

/**
 * Lightweight HTTP client tailored to the Pushpad API.
 */
export class HttpClient {
  /**
   * @param {{
   *  authToken: string,
   *  baseUrl?: string,
   *  fetch?: typeof fetch,
   *  timeout?: number
   * }} options
   */
  constructor(options) {
    if (!options || typeof options !== 'object') {
      throw new Error('HttpClient requires an options object.');
    }

    const {
      authToken,
      baseUrl = DEFAULT_BASE_URL,
      fetch: customFetch,
      timeout
    } = options;

    if (!authToken) {
      throw new Error('An authToken must be provided.');
    }

    this.authToken = authToken;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fetch = resolveFetch(customFetch);
    this.timeout = timeout;
  }

  /**
   * Performs an HTTP request against the Pushpad API.
   * @param {string} method
   * @param {string} path
   * @param {HttpClientRequestOptions} [options]
   */
  async request(method, path, options = {}) {
    const {
      query,
      body,
      headers = {},
      expectedStatuses,
      expectBody
    } = options;

    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(normalizedPath, base);
    const params = buildQueryParams(query);
    if (params) {
      url.search = params.toString();
    }

    const requestHeaders = new Headers({
      Accept: 'application/json',
      Authorization: `Bearer ${this.authToken}`
    });

    if (body !== undefined) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    for (const [key, value] of Object.entries(headers)) {
      requestHeaders.set(key, value);
    }

    const controller = typeof AbortController === 'function' ? new AbortController() : undefined;
    let timeoutId;

    const fetchPromise = this.fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller?.signal
    });

    if (controller && this.timeout && this.timeout > 0) {
      timeoutId = setTimeout(() => controller.abort(), this.timeout);
    }

    let response;
    try {
      response = await fetchPromise;
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new PushpadError('Request timed out', {
          status: 0,
          request: { method, url: url.toString(), body }
        });
      }
      throw error;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    const expected = Array.isArray(expectedStatuses)
      ? expectedStatuses
      : expectedStatuses !== undefined
        ? [expectedStatuses]
        : undefined;

    const successfulStatusCodes = expected ?? [200, 201, 202, 204];
    const hasSuccessfulStatus = successfulStatusCodes.includes(response.status);

    const contentType = response.headers.get('content-type') ?? '';
    const shouldParseBody = expectBody ?? (response.status !== 204 && contentType.includes('application/json'));

    let parsedBody;
    if (shouldParseBody) {
      const raw = await response.text();
      if (raw) {
        if (contentType.includes('application/json')) {
          try {
            parsedBody = JSON.parse(raw);
          } catch (error) {
            throw new PushpadError('Failed to parse JSON response', {
              status: response.status,
              statusText: response.statusText,
              body: raw,
              request: { method, url: url.toString(), body }
            });
          }
        } else {
          parsedBody = raw;
        }
      }
    }

    if (!hasSuccessfulStatus) {
      throw new PushpadError(`Pushpad API request failed with status ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        body: parsedBody,
        headers: Object.fromEntries(response.headers.entries()),
        request: { method, url: url.toString(), body }
      });
    }

    return parsedBody;
  }
}

export default HttpClient;
