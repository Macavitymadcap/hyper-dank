import { describe, expect, test } from "bun:test";
import { LiveRegionPanel } from "./LiveRegionPanel";

const render = (node: unknown): string => String(node);

describe("LiveRegionPanel", () => {
  test("renders an accessible live fragment target with app-owned state", () => {
    const html = render(
      <LiveRegionPanel id="room-fragment" title="Room state" status="Updated just now">
        <p>Three participants connected.</p>
      </LiveRegionPanel>,
    );

    expect(html).toContain('id="room-fragment"');
    expect(html).toContain('class="live-region-panel"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('<h2 id="room-fragment-heading">Room state</h2>');
    expect(html).toContain("Updated just now");
    expect(html).toContain("Three participants connected.");
  });

  test("passes HTMX and SSE attributes while rendering loading and empty states", () => {
    const loadingHtml = render(
      <LiveRegionPanel
        id="score-fragment"
        busy
        loading={<p>Refreshing scores...</p>}
        hx-get="/scores"
        hx-trigger="load, every 10s"
        hx-swap="outerHTML"
        sse-connect="/events"
        sse-swap="score"
      />,
    );
    const emptyHtml = render(<LiveRegionPanel id="empty-fragment" empty="No updates yet." />);

    expect(loadingHtml).toContain('aria-busy="true"');
    expect(loadingHtml).toContain("Refreshing scores...");
    expect(loadingHtml).toContain('hx-get="/scores"');
    expect(loadingHtml).toContain('hx-trigger="load, every 10s"');
    expect(loadingHtml).toContain('hx-swap="outerHTML"');
    expect(loadingHtml).toContain('sse-connect="/events"');
    expect(loadingHtml).toContain('sse-swap="score"');
    expect(emptyHtml).toContain("No updates yet.");
  });
});
