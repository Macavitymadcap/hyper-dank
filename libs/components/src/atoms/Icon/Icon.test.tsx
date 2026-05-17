import { describe, expect, test } from "bun:test";
import { Icon } from "./Icon";

describe("Icon", () => {
  test("renders decorative icons as hidden", () => {
    const html = String(<Icon name="menu" />);

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-icon="menu"');
  });

  test("renders labelled icons with image semantics", () => {
    const html = String(<Icon label="Success" name="check" tone="success" />);

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Success"');
    expect(html).toContain('data-icon="check-circle"');
  });
});
