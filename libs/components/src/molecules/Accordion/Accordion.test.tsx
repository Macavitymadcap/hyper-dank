import { describe, expect, test } from "bun:test";
import { Accordion } from "./Accordion";

describe("Accordion", () => {
  test("renders details items with shared name", () => {
    const html = String(
      <Accordion
        name="example"
        items={[{ body: "Body", id: "item-body", meta: "Meta", title: "Title" }]}
      />,
    );

    expect(html).toContain("<details");
    expect(html).toContain('name="example"');
    expect(html).toContain("Title");
    expect(html).toContain("Meta");
  });
});
