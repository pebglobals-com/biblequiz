import { renderDynamicPage } from "../../../../lib/render-dynamic-page";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const slug = url.pathname.match(/\/senior\/sermons\/([^/]+)\/study/)?.[1] || "";
  return renderDynamicPage(request, env, "/senior/sermons/placeholder/study/", slug);
}
