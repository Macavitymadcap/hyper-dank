import { describe, expect, test } from "bun:test";
import { PageHeader } from "./PageHeader";

const render = (node: unknown): string => String(node);

describe("PageHeader", () => {
  test("renders title, description, metadata, and actions", () => {
    const html = render(
      <PageHeader
        id="content"
        title="Entries"
        description="Recent activity"
        metadata={<span>12 total</span>}
        actions={<a href="/new">New</a>}
      />,
    );

    expect(html).toContain('class="page-header"');
    expect(html).toContain('aria-labelledby="content-title"');
    expect(html).toContain("<h1");
    expect(html).toContain('class="page-header-actions"');
  });
});
