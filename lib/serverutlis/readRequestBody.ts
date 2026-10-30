// Internal callers share request types; this assertion does not validate JSON at runtime.
export async function readRequestBody<T>(request: Pick<Request, 'json'>): Promise<T> {
  const body: unknown = await request.json();
  return body as T;
}
