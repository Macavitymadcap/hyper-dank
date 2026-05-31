import { describe, expect, test } from "bun:test";
import { Button } from "../../atoms/Button";
import { LinkButton } from "../../atoms/LinkButton";
import { ActionPanel } from "./ActionPanel";

const render = (node: unknown): string => String(node);

describe("ActionPanel", () => {
  test("renders grouped app-owned actions with semantic sections", () => {
    const html = render(
      <ActionPanel
        id="review-actions"
        title="Review actions"
        meta="Editor access required"
        primaryActions={<Button>Publish</Button>}
        secondaryActions={<LinkButton href="/preview">Preview</LinkButton>}
        destructiveActions={
          <Button variant="danger" hx-delete="/draft" hx-confirm="Delete draft?">
            Delete draft
          </Button>
        }
      >
        Choose the next state for this item.
      </ActionPanel>,
    );

    expect(html).toContain('class="action-panel"');
    expect(html).toContain('aria-labelledby="review-actions-heading"');
    expect(html).toContain('<h2 id="review-actions-heading">Review actions</h2>');
    expect(html).toContain("Editor access required");
    expect(html).toContain('class="action-panel-actions-primary"');
    expect(html).toContain('class="action-panel-actions-secondary"');
    expect(html).toContain('class="action-panel-actions-danger"');
    expect(html).toContain('hx-delete="/draft"');
    expect(html).toContain('hx-confirm="Delete draft?"');
  });

  test("passes HTMX attributes to the panel shell", () => {
    const html = render(
      <ActionPanel
        title="Refresh actions"
        hx-get="/actions"
        hx-trigger="revealed"
        hx-target="#actions"
      />,
    );

    expect(html).toContain('hx-get="/actions"');
    expect(html).toContain('hx-trigger="revealed"');
    expect(html).toContain('hx-target="#actions"');
  });
});
