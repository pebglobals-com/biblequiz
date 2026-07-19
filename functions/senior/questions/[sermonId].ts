export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const id = url.pathname.replace(/^\/senior\/questions\//, "").replace(/\/$/, "");
  if (!id) return new Response("Not found", { status: 404 });
  const ph = await env.ASSETS.fetch(new Request(new URL("/senior/questions/placeholder/", request.url)));
  if (!ph.ok) return new Response("Not found", { status: 404 });
  return new Response((await ph.text()).replaceAll('\\"placeholder\\"', '\\"' + id + '\\"'), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
