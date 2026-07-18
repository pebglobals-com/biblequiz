import { renderDynamicPage } from "../../../lib/render-dynamic-page";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const sermonId = url.pathname.replace(/^\/junior\/questions\//, "").replace(/\/$/, "");
  return renderDynamicPage(request, env, "/junior/questions/placeholder/", sermonId);
}
