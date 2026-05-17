import { describe, expect, test } from "bun:test";
import { WalkForm } from "./WalkForm";

const render = (node: unknown): string => String(node);

describe("WalkForm", () => {
  test("renders the HTMX form contract", () => {
    const html = render(<WalkForm />);

    expect(html).toContain('action="/walks"');
    expect(html).toContain('method="post"');
    expect(html).toContain('hx-post="/walks"');
    expect(html).toContain('hx-target="#walks-list"');
    expect(html).toContain('hx-swap="innerHTML"');
    expect(html).toContain('hx-on--after-request="this.reset()"');
    expect(html).toContain('name="miles"');
    expect(html).toContain('name="minutes"');
    expect(html).toContain('name="seconds"');
    expect(html).toContain("Add</button>");
  });
});
