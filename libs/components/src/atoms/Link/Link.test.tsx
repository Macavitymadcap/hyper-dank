import { describe, expect, test } from "bun:test";
import { Link } from "./Link";

const render = (node: unknown): string => String(node);

describe("Link", () => {
  test("renders native links with current and external affordances", () => {
    const html = render(
      <Link href="https://example.com" external current>
        Docs
      </Link>,
    );

    expect(html).toContain('class="link"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });
});
