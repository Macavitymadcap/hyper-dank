import { describe, expect, test } from "bun:test";
import type { Context } from "hono";
import { fragmentOrPage, HttpResponder, isHtmxRequest } from "./responder";

describe("HttpResponder", () => {
  test("detects HTMX requests by header", () => {
    const responder = new HttpResponder();

    expect(responder.isHtmxRequest(createContext("true"))).toBe(true);
    expect(responder.isHtmxRequest(createContext())).toBe(false);
    expect(isHtmxRequest(new Headers({ "HX-Request": "true" }))).toBe(true);
    expect(isHtmxRequest({ "hx-request": "true" })).toBe(true);
  });

  test("redirects HTMX requests through HX-Redirect and preserves cookies", () => {
    const responder = new HttpResponder();
    const context = createContext("true");
    const response = responder.redirectWithAuthCookies(
      context,
      "/",
      new Response(null, {
        headers: {
          "set-cookie": "session=abc",
        },
      }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("HX-Redirect")).toBe("/");
    expect(response.headers.get("set-cookie")).toBe("session=abc");
  });

  test("uses native redirects when HTMX is not present", () => {
    const responder = new HttpResponder();
    const response = responder.redirectAfterAction(createContext(), "/login");

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/login");
  });

  test("uses native auth redirects when no auth cookies are present", () => {
    const responder = new HttpResponder();
    const response = responder.redirectWithAuthCookies(createContext(), "/login", new Response());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/login");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  test("renders fragments for HTMX and pages for native requests", async () => {
    const htmxResponse = await fragmentOrPage(createContext("true"), {
      fragment: "<p>Saved</p>",
      page: "<html><body>Saved</body></html>",
    });
    const nativeResponse = await fragmentOrPage(createContext(), {
      fragment: "<p>Saved</p>",
      page: "<html><body>Saved</body></html>",
      status: 201,
    });

    expect(await htmxResponse.text()).toBe("<p>Saved</p>");
    expect(htmxResponse.status).toBe(200);
    expect(await nativeResponse.text()).toBe("<html><body>Saved</body></html>");
    expect(nativeResponse.status).toBe(201);
  });
});

function createContext(hxRequest?: string): Context {
  return {
    body: (body: string | null, status: number) => new Response(body, { status }),
    html: (body: string, status: number) =>
      new Response(body, {
        headers: { "content-type": "text/html; charset=UTF-8" },
        status,
      }),
    redirect: (location: string, status: number) =>
      new Response(null, {
        headers: { location },
        status,
      }),
    req: {
      header: (name: string) => (name === "HX-Request" ? hxRequest : undefined),
    },
  } as Context;
}
