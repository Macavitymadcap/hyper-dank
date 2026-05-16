import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { LogoutForm } from "./LogoutForm";

describe("LogoutForm", () => {
  test("renders HTMX logout with a native POST fallback", () => {
    const html = renderToString(<LogoutForm />);

    expect(html).toContain('action="/logout"');
    expect(html).toContain('method="post"');
    expect(html).toContain('hx-post="/logout"');
    expect(html).toContain('hx-swap="none"');
    expect(html).toContain(">Sign out</button>");
  });
});
