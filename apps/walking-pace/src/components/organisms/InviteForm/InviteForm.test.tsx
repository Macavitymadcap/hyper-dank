import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { InviteForm } from "./InviteForm";

describe("InviteForm", () => {
  test("renders invite acceptance with progressive submission", () => {
    const html = renderToString(<InviteForm token="abc" error="Expired" />);

    expect(html).toContain('action="/invite/abc"');
    expect(html).toContain('method="post"');
    expect(html).toContain('hx-post="/invite/abc"');
    expect(html).toContain('hx-target="this"');
    expect(html).toContain('autocomplete="new-password"');
    expect(html).toContain("Expired");
  });
});
