import { describe, expect, test } from "bun:test";
import { MetadataList } from "./MetadataList";

const render = (node: unknown): string => String(node);

describe("MetadataList", () => {
  test("renders flexible metadata rows", () => {
    const html = render(<MetadataList items={[{ label: "Author", value: "Ada" }]} />);

    expect(html).toContain('class="metadata-list"');
    expect(html).toContain('class="metadata-list-row"');
    expect(html).toContain("<dt>Author</dt>");
  });
});
