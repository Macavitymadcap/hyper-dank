import type { Context } from "hono";

export class HttpResponder {
  constructor(private readonly htmxHeaderName = "HX-Request") {}

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
