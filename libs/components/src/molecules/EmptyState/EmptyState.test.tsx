import { describe, expect, test } from "bun:test";
import { EmptyState } from "./EmptyState";

const render = (node: unknown): string => String(node);

describe("EmptyState", () => {
  test("renders blank-state copy with optional actions", () => {
    const html = render(<EmptyState title="Nothing here" actions={<a href="/new">Create</a>} />);

    expect(html).toContain('class="empty-state"');
    expect(html).toContain("<h2>Nothing here</h2>");
    expect(html).toContain('class="empty-state-actions"');
  });
});
