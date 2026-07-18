import { renderDynamicPage } from "../../../lib/render-dynamic-page";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const sermonId = url.pathname.replace(/^\/senior\/questions\//, "").replace(/\/$/, "");
  return renderDynamicPage(request, env, "/senior/questions/placeholder/", sermonId);
}
