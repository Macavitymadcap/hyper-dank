import { describe, expect, test } from "bun:test";
import type { Context } from "hono";
import { HttpResponder } from "./responder";

describe("HttpResponder", () => {
  test("detects HTMX requests by header", () => {
    const responder = new HttpResponder();

    expect(responder.isHtmxRequest(createContext("true"))).toBe(true);
    expect(responder.isHtmxRequest(createContext())).toBe(false);
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
});

function createContext(hxRequest?: string): Context {
  return {
    body: (body: string | null, status: number) => new Response(body, { status }),
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
