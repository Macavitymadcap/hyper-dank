import { describe, expect, test } from "bun:test";
import { CopyField } from "./CopyField";

const render = (node: unknown): string => String(node);

describe("CopyField", () => {
  test("renders a labelled read-only value with accessible copy status", () => {
    const html = render(
      <CopyField
        id="share-url"
        label="Share URL"
        helpText="Send this link to collaborators."
        status="Copied to clipboard."
        value="https://example.test/share/abc"
      />,
    );

    expect(html).toContain('class="copy-field"');
    expect(html).toContain('<label id="share-url-label" for="share-url">Share URL</label>');
    expect(html).toContain('readOnly="true"');
    expect(html).toContain('value="https://example.test/share/abc"');
    expect(html).toContain('data-copy-target="share-url"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Copied to clipboard.");
  });

  test("accepts app-owned actions and HTMX attributes without owning clipboard behaviour", () => {
    const html = render(
      <CopyField
        id="invite-token"
        label="Invite token"
        value="abc123"
        hx-post="/share/copy"
        hx-target="#copy-status"
        actions={
          <button type="button" data-clipboard-target="#invite-token">
            Copy link
          </button>
        }
      />,
    );

    expect(html).toContain('hx-post="/share/copy"');
    expect(html).toContain('hx-target="#copy-status"');
    expect(html).toContain('data-clipboard-target="#invite-token"');
    expect(html).toContain("Copy link");
  });
});
