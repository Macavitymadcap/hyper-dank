import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const HTMX_REQUEST_HEADER = "HX-Request";

export type HeaderSource =
  | Headers
  | Record<string, string | null | undefined>
  | { get(name: string): string | null | undefined };

export interface FragmentOrPageOptions {
  fragment: string | Promise<string>;
  page: string | Promise<string>;
  status?: ContentfulStatusCode;
}

export class HttpResponder {
  constructor(private readonly htmxHeaderName = HTMX_REQUEST_HEADER) {}

  isHtmxRequest(context: Context): boolean {
    return context.req.header(this.htmxHeaderName) === "true";
  }

  redirectAfterAction(context: Context, location: string): Response {
    if (this.isHtmxRequest(context)) {
      const response = context.body(null, 204);
      response.headers.set("HX-Redirect", location);
      return response;
    }

    return context.redirect(location, 303);
  }

  redirectWithAuthCookies(context: Context, location: string, authResponse: Response): Response {
    const response = this.redirectAfterAction(context, location);
    const cookie = authResponse.headers.get("set-cookie");
    if (cookie) response.headers.append("set-cookie", cookie);
    return response;
  }
}

export function isHtmxRequest(headers: HeaderSource, headerName = HTMX_REQUEST_HEADER): boolean {
  return readHeader(headers, headerName) === "true";
}

export async function fragmentOrPage(
  context: Context,
  options: FragmentOrPageOptions,
  responder = new HttpResponder(),
): Promise<Response> {
  const body = await (responder.isHtmxRequest(context) ? options.fragment : options.page);
  return context.html(body, options.status ?? 200);
}

function readHeader(headers: HeaderSource, name: string): string | undefined {
  if (headers instanceof Headers) return headers.get(name) ?? undefined;

  if ("get" in headers && typeof headers.get === "function") {
    return headers.get(name) ?? undefined;
  }

  const headerRecord = headers as Record<string, string | null | undefined>;
  return headerRecord[name] ?? headerRecord[name.toLowerCase()] ?? undefined;
}
