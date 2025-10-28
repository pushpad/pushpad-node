export class PushpadError extends Error {
  status: number;
  statusText?: string;
  body?: unknown;
  headers?: Record<string, string>;
  request?: {
    method: string;
    url: string;
    body?: unknown;
  };
}
