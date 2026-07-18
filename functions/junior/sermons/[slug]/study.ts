export async function onRequest({ request, env }: { request: Request; env: any }) {
  const match = new URL(request.url).pathname.match(/\/junior\/sermons\/([^/]+)\/study/);
  if (!match) return new Response("Not found", { status: 404 });
  const ph = await env.ASSETS.fetch(new Request(new URL("/junior/sermons/placeholder/study/", request.url)));
  if (!ph.ok) return new Response("Not found", { status: 404 });
  return new Response((await ph.text()).replaceAll('"placeholder"', `"${match[1]}"`), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
