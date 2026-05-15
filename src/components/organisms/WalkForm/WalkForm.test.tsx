import { describe, expect, test } from "bun:test";
import { WalkForm } from "./WalkForm";

const render = (node: unknown): string => String(node);

describe("WalkForm", () => {
  test("renders the HTMX form contract", () => {
    const html = render(<WalkForm />);

    expect(html).toContain('hx-post="/walks"');
    expect(html).toContain('hx-target="#walks-list"');
    expect(html).toContain('hx-swap="innerHTML"');
    expect(html).toContain("htmx.trigger(&#39;#stats&#39;, &#39;refresh&#39;)");
    expect(html).toContain('name="miles"');
    expect(html).toContain('name="minutes"');
    expect(html).toContain('name="seconds"');
    expect(html).toContain("Add</button>");
  });
});
