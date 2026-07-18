export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/senior\/sermons\//, "").replace(/\/$/, "");
  if (!slug) return new Response("Not found", { status: 404 });
  const ph = await env.ASSETS.fetch(new Request(new URL("/senior/sermons/placeholder/", request.url)));
  if (!ph.ok) return new Response("Not found", { status: 404 });
  return new Response((await ph.text()).replaceAll('"placeholder"', `"${slug}"`), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
