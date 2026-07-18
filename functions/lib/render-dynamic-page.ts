export async function renderDynamicPage(
  request: Request,
  env: { ASSETS: { fetch: (req: Request) => Promise<Response> } },
  placeholderPath: string,
  paramValue: string,
): Promise<Response> {
  const actual = await env.ASSETS.fetch(request.clone());
  if (actual.status !== 404) return actual;

  const placeholderUrl = new URL(placeholderPath, request.url);
  const phResponse = await env.ASSETS.fetch(new Request(placeholderUrl));
  if (!phResponse.ok) return actual;

  const html = await phResponse.text();
  const modified = html.replaceAll('"placeholder"', `"${paramValue}"`);

  return new Response(modified, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
