import { describe, expect, test } from "bun:test";
import { CompactList } from "./CompactList";

describe("CompactList", () => {
  test("renders definition-list rows", () => {
    const html = String(<CompactList items={[{ label: "HP", meta: "temporary", value: "27" }]} />);

    expect(html).toContain("<dl");
    expect(html).toContain("<dt>HP</dt>");
    expect(html).toContain("<strong>27</strong>");
  });
});
