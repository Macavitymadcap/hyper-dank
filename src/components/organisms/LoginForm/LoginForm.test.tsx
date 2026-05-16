import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  test("renders progressive form submission with native fallback", () => {
    const html = renderToString(<LoginForm error="Nope" />);

    expect(html).toContain('action="/login"');
    expect(html).toContain('method="post"');
    expect(html).toContain('hx-post="/login"');
    expect(html).toContain('hx-target="this"');
    expect(html).toContain("Nope");
  });
});
