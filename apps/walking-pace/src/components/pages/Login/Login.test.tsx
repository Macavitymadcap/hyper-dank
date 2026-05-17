import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { LoginPage } from "./Login";

describe("LoginPage", () => {
  test("composes the document shell and login form", () => {
    const html = renderToString(<LoginPage error="Invalid" />);

    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("<main");
    expect(html).toContain("Walking Pace Tracker");
    expect(html).toContain('action="/login"');
    expect(html).toContain("Invalid");
  });
});
