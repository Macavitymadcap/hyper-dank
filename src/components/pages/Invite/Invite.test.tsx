import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { InvitePage } from "./Invite";

describe("InvitePage", () => {
  test("composes the document shell and invite form", () => {
    const html = renderToString(<InvitePage token="abc" error="Expired" />);

    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("<main");
    expect(html).toContain("Accept invite");
    expect(html).toContain('action="/invite/abc"');
    expect(html).toContain("Expired");
  });
});
