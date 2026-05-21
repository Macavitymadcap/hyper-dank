import { describe, expect, test } from "bun:test";
import { TimelineList } from "./TimelineList";

const render = (node: unknown): string => String(node);

describe("TimelineList", () => {
  test("renders timeline items with optional time metadata", () => {
    const html = render(<TimelineList items={[{ label: "Published", time: "2026-05-19" }]} />);

    expect(html).toContain('class="timeline-list"');
    expect(html).toContain("<ol");
    expect(html).toContain('datetime="2026-05-19"');
  });
});
