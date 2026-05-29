import { describe, expect, test } from "bun:test";
import { Badge } from "./Badge";

describe("Badge", () => {
  test("renders neutral metadata by default", () => {
    expect(String(<Badge>Ready</Badge>)).toBe(
      '<span class="badge" data-tone="neutral">Ready</span>',
    );
  });

  test("accepts an app styling class hook", () => {
    expect(String(<Badge className="queue-badge">Ready</Badge>)).toBe(
      '<span class="badge queue-badge" data-tone="neutral">Ready</span>',
    );
  });
});
