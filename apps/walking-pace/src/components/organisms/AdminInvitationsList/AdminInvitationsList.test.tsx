import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { AdminInvitationsList } from "./AdminInvitationsList";

const invitation = {
  acceptedAt: undefined,
  acceptedByUserId: undefined,
  createdAt: "2026-05-16T00:00:00.000Z",
  email: "invited@example.com",
  expiresAt: "2026-05-23T00:00:00.000Z",
  id: "invite-1",
  invitedByUserId: "admin@example.com",
  revokedAt: undefined,
  role: "user" as const,
  status: "pending" as const,
};

describe("AdminInvitationsList", () => {
  test("renders pending invitation actions with native fallback", () => {
    const html = renderToString(<AdminInvitationsList invitations={[invitation]} />);

    expect(html).toContain("invited@example.com");
    expect(html).toContain('action="/admin/invites/invite-1/revoke"');
    expect(html).toContain('hx-post="/admin/invites/invite-1/revoke"');
    expect(html).toContain(">Revoke</button>");
  });

  test("renders an empty state", () => {
    const html = renderToString(<AdminInvitationsList invitations={[]} />);

    expect(html).toContain("No invitations yet.");
  });
});
