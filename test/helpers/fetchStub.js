export function createFetchStub(responses = []) {
  const calls = [];

  const stub = async (url, options = {}) => {
    calls.push({ url, options });

    const next = responses.length ? responses.shift() : {};
    const status = next.status ?? 200;
    const statusText = next.statusText ?? (status >= 400 ? 'Error' : 'OK');
    const headersInit = next.headers ?? {};
    const headers = new Headers(headersInit);

    if (!headers.has('content-type') && status !== 204) {
      headers.set('content-type', 'application/json');
    }

    const body = next.body;

    return {
      status,
      statusText,
      headers,
      text: async () => {
        if (status === 204) {
          return '';
        }
        if (body === undefined) {
          return '';
        }
        return typeof body === 'string' ? body : JSON.stringify(body);
      }
    };
  };

  Object.defineProperty(stub, 'calls', {
    value: calls,
    enumerable: true
  });

  return stub;
}

export default createFetchStub;
