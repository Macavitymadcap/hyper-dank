import { describe, expect, test } from "bun:test";
import { CodeBlock } from "./CodeBlock";

const render = (node: unknown): string => String(node);

describe("CodeBlock", () => {
  test("renders escaped code with an optional language class", () => {
    const html = render(<CodeBlock language="ts" code={'const value = "<safe>";'} />);

    expect(html).toContain('class="code-block"');
    expect(html).toContain('class="language-ts"');
    expect(html).toContain("&lt;safe&gt;");
  });
});
