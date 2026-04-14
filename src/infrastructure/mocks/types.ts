export type RouteHandler = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pattern: string;
  resolve: (
    params: Record<string, string>,
    req: Request,
  ) => Response | Promise<Response>;
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const uid = () => Date.now().toString();
