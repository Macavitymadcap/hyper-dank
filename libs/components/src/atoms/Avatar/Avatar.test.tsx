import { describe, expect, test } from "bun:test";
import { Avatar } from "./Avatar";

const render = (node: unknown): string => String(node);

describe("Avatar", () => {
  test("renders fallback initials with an accessible name", () => {
    const html = render(<Avatar name="Ada Lovelace" />);

    expect(html).toContain('class="avatar"');
    expect(html).toContain('data-size="md"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Ada Lovelace"');
    expect(html).toContain('class="avatar-fallback" aria-hidden="true">AL');
  });

  test("renders image avatars with alt text", () => {
    const html = render(<Avatar name="Grace Hopper" src="/grace.png" size="lg" />);

    expect(html).toContain('data-size="lg"');
    expect(html).toContain('class="avatar-image"');
    expect(html).toContain('src="/grace.png"');
    expect(html).toContain('alt="Grace Hopper"');
  });
});
