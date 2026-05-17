import { describe, expect, test } from "bun:test";
import { Badge } from "./Badge";

describe("Badge", () => {
  test("renders neutral metadata by default", () => {
    expect(String(<Badge>Ready</Badge>)).toBe(
      '<span class="badge" data-tone="neutral">Ready</span>',
    );
  });
});
