import { handlers } from './handlers';

function matchRoute(
  pattern: string,
  pathname: string,
): Record<string, string> | null {
  const paramNames: string[] = [];
  const regexStr = pattern.replace(/:([^/]+)/g, (_, name: string) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  const match = pathname.match(new RegExp(`^${regexStr}$`));
  if (!match) return null;
  return Object.fromEntries(paramNames.map((n, i) => [n, match[i + 1]]));
}

export function startMockServer(): void {
  const originalFetch = global.fetch as typeof fetch;

  (global as typeof globalThis & { fetch: typeof fetch }).fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    // Normaliza a URL para string
    const urlString =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url;

    const method = (init?.method ?? 'GET').toUpperCase();

    let pathname: string;
    try {
      pathname = new URL(urlString).pathname;
    } catch {
      return originalFetch(input, init);
    }

    for (const handler of handlers) {
      if (handler.method !== method) continue;
      const params = matchRoute(handler.pattern, pathname);
      if (params !== null) {
        return handler.resolve(params, new Request(urlString, init));
      }
    }

    return originalFetch(input, init);
  };

  console.log('[Mock] 🟢 Servidor de mocks ativado');
}
