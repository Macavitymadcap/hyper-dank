import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { AdminUsersList } from "./AdminUsersList";

const user = {
  banned: false,
  email: "walker@example.com",
  id: "walker@example.com",
  name: "Everyday Walker",
  role: "user" as const,
};

describe("AdminUsersList", () => {
  test("renders account navigation and progressive account actions", () => {
    const html = renderToString(<AdminUsersList users={[user]} selectedUserId={user.id} />);

    expect(html).toContain('data-selected="true"');
    expect(html).toContain('href="/admin?userId=walker@example.com"');
    expect(html).toContain('hx-get="/admin?userId=walker@example.com"');
    expect(html).toContain('action="/admin/users/walker@example.com/role"');
    expect(html).toContain('hx-post="/admin/users/walker@example.com/role"');
    expect(html).toContain('action="/admin/users/walker@example.com/ban"');
  });
});
