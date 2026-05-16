import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { AdminDashboard } from "./AdminDashboard";

const user = {
  banned: false,
  email: "admin@example.com",
  id: "admin@example.com",
  name: "Admin User",
  role: "admin" as const,
};

describe("AdminDashboard", () => {
  test("renders smaller admin sections with progressive forms", () => {
    const html = renderToString(
      <AdminDashboard
        users={[user]}
        invitations={[]}
        selectedUser={user}
        selectedWalks={[]}
        selectedStats={{ avgSpeed: 0, count: 0, medianPace: 0 }}
      />,
    );

    expect(html).toContain('id="admin-panel"');
    expect(html).toContain('action="/admin/invites"');
    expect(html).toContain('hx-post="/admin/invites"');
    expect(html).toContain('hx-target="#admin-panel"');
    expect(html).toContain('hx-get="/admin?userId=admin@example.com"');
    expect(html).toContain('action="/admin/users/admin@example.com/role"');
    expect(html).toContain('hx-post="/admin/users/admin@example.com/role"');
  });
});
