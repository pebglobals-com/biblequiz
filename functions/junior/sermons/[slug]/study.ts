import { renderDynamicPage } from "../../../../lib/render-dynamic-page";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const slug = url.pathname.match(/\/junior\/sermons\/([^/]+)\/study/)?.[1] || "";
  return renderDynamicPage(request, env, "/junior/sermons/placeholder/study/", slug);
}
