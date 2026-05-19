import { describe, expect, test } from "bun:test";
import { Dialog } from "./Dialog";

const render = (node: unknown): string => String(node);

describe("Dialog", () => {
  test("renders native dialog with trigger, close form, fallback, and HTMX attrs", () => {
    const html = render(
      <Dialog
        id="confirm"
        title="Confirm"
        triggerLabel="Open confirm"
        fallbackHref="/confirm"
        hx-get="/confirm"
      >
        Body
      </Dialog>,
    );

    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-controls="confirm"');
    expect(html).toContain("<dialog");
    expect(html).toContain('aria-labelledby="confirm-title"');
    expect(html).toContain('method="dialog"');
    expect(html).toContain('hx-get="/confirm"');
    expect(html).toContain('href="/confirm"');
  });
});
