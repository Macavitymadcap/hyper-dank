import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { HxForm } from "./HxForm";

describe("HxForm", () => {
  test("renders native form fallback and HTMX attributes", () => {
    const html = renderToString(
      <HxForm action="/login" method="post" hx-post="/login" hx-swap="outerHTML" hx-target="this">
        <button type="submit">Submit</button>
      </HxForm>,
    );

    expect(html).toContain('action="/login"');
    expect(html).toContain('method="post"');
    expect(html).toContain('hx-post="/login"');
    expect(html).toContain('hx-target="this"');
    expect(html).toContain('hx-swap="outerHTML"');
  });
});
