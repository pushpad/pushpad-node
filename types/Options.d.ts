export interface RequestOptions {
  projectId?: number;
}

export interface PushpadOptions {
  authToken: string;
  projectId?: number;
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
}
