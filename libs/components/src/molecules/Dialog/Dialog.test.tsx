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

  test("serializes the trigger target id as a JavaScript string literal", () => {
    const html = render(
      <Dialog id={`x');alert(1);//`} title="Confirm" triggerLabel="Open confirm">
        Body
      </Dialog>,
    );

    expect(html).toContain("document.getElementById(&quot;x&#39;);alert(1);//&quot;)?.showModal()");
    expect(html).not.toContain("document.getElementById(&#39;x&#39;);alert(1);//");
  });
});
