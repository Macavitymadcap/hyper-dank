import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { AdminInviteForm } from "./AdminInviteForm";

describe("AdminInviteForm", () => {
  test("renders invite fields with HTMX and native form submission", () => {
    const html = renderToString(<AdminInviteForm />);

    expect(html).toContain('action="/admin/invites"');
    expect(html).toContain('method="post"');
    expect(html).toContain('hx-post="/admin/invites"');
    expect(html).toContain('hx-target="#admin-panel"');
    expect(html).toContain('name="email"');
    expect(html).toContain('name="role"');
  });
});
