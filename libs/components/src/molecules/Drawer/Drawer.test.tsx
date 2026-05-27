import { describe, expect, test } from "bun:test";
import { Drawer } from "./Drawer";

const render = (node: unknown): string => String(node);

describe("Drawer", () => {
  test("renders a native side-panel dialog with trigger, fallback, close path, and content", () => {
    const html = render(
      <Drawer
        id="mobile-nav"
        title="Navigation"
        description="Jump to a section."
        triggerLabel="Open navigation"
        fallbackHref="/navigation"
        placement="start"
        actions={<a href="/settings">Settings</a>}
      >
        <nav aria-label="Sections">
          <a href="/dashboard">Dashboard</a>
        </nav>
      </Drawer>,
    );

    expect(html).toContain('class="drawer-wrapper"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-label="Open navigation"');
    expect(html).toContain('aria-controls="mobile-nav"');
    expect(html).toContain("<dialog");
    expect(html).toContain('data-placement="start"');
    expect(html).toContain('aria-labelledby="mobile-nav-title"');
    expect(html).toContain('aria-describedby="mobile-nav-description"');
    expect(html).toContain('href="/navigation"');
    expect(html).toContain('method="dialog"');
    expect(html).toContain('class="drawer-actions"');
    expect(html).toContain('aria-label="Sections"');
  });

  test("passes HTMX attributes to the drawer trigger", () => {
    const html = render(
      <Drawer
        id="filters"
        title="Filters"
        triggerLabel="Open filters"
        hx-get="/filters"
        hx-target="#filters"
        hx-swap="innerHTML"
      >
        Filter controls.
      </Drawer>,
    );

    expect(html).toContain('hx-get="/filters"');
    expect(html).toContain('hx-target="#filters"');
    expect(html).toContain('hx-swap="innerHTML"');
  });

  test("keeps a custom trigger accessible through the trigger label", () => {
    const html = render(
      <Drawer id="actions" title="Actions" triggerLabel="Open actions" trigger={<span>...</span>}>
        Actions.
      </Drawer>,
    );

    expect(html).toContain('aria-label="Open actions"');
    expect(html).toContain("<span>...</span>");
  });

  test("serializes the trigger target id as a JavaScript string literal", () => {
    const html = render(
      <Drawer id={`x');alert(1);//`} title="Panel" triggerLabel="Open panel">
        Body
      </Drawer>,
    );

    expect(html).toContain("document.getElementById(&quot;x&#39;);alert(1);//&quot;)?.showModal()");
    expect(html).not.toContain("document.getElementById(&#39;x&#39;);alert(1);//");
  });
});
