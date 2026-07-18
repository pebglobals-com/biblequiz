import { renderDynamicPage } from "../../../lib/render-dynamic-page";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/senior\/sermons\//, "").replace(/\/$/, "");
  return renderDynamicPage(request, env, "/senior/sermons/placeholder/", slug);
}
