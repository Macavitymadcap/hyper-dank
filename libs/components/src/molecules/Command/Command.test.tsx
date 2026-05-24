import { describe, expect, test } from "bun:test";
import { Command } from "./Command";

describe("Command", () => {
  test("renders a labelled command search with selectable results", () => {
    const html = String(
      <Command
        id="command-search"
        label="Command search"
        query="publish"
        items={[
          { href: "/posts?status=draft", label: "Filter drafts", value: "draft" },
          {
            current: true,
            description: "Submit the current article",
            href: "/posts/publish",
            label: "Publish article",
            value: "publish",
          },
        ]}
      />,
    );

    expect(html).toContain('<search class="command"');
    expect(html).toContain('<form action="" method="get">');
    expect(html).toContain('<label for="command-search-input">Command search</label>');
    expect(html).toContain('type="search"');
    expect(html).toContain('aria-controls="command-search-results"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('role="option"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Submit the current article");
  });

  test("renders an empty result state without owning filtering", () => {
    const html = String(
      <Command id="command-empty" label="Find action" items={[]} emptyText="No commands found." />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain("No commands found.");
    expect(html).toContain('data-empty="true"');
  });
});
