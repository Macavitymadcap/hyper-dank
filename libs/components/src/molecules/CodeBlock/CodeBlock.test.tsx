import { describe, expect, test } from "bun:test";
import { CodeBlock } from "./CodeBlock";

const render = (node: unknown): string => String(node);

describe("CodeBlock", () => {
  test("renders escaped code with an optional language class", () => {
    const html = render(<CodeBlock language="ts" code={'const value = "<safe>";'} />);

    expect(html).toContain('class="code-block"');
    expect(html).toContain('class="language-ts"');
    expect(html).toContain("&lt;safe&gt;");
    expect(html).toContain('data-token="keyword"');
    expect(html).toContain('data-token="string"');
  });

  test("keeps unsupported languages as plain escaped text", () => {
    const html = render(<CodeBlock language="sh" code={'echo "<safe>"'} />);

    expect(html).toContain('class="language-sh"');
    expect(html).toContain("echo &quot;&lt;safe&gt;&quot;");
    expect(html).not.toContain("code-token");
  });
});
