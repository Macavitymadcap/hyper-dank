import { describe, expect, test } from "bun:test";
import { NotificationBanner } from "./NotificationBanner";

const render = (node: unknown): string => String(node);

describe("NotificationBanner", () => {
  test("renders warning and danger banners as assertive alerts", () => {
    const html = render(
      <NotificationBanner severity="danger" title="Deploy blocked">
        Fix the failing check.
      </NotificationBanner>,
    );

    expect(html).toContain('class="notification-banner"');
    expect(html).toContain('data-severity="danger"');
    expect(html).toContain('data-shape="octagon"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="assertive"');
    expect(html).toContain('class="status-symbol"');
  });

  test("renders non-urgent banners as polite statuses", () => {
    const html = render(
      <NotificationBanner severity="success" title="Saved">
        Draft stored.
      </NotificationBanner>,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('data-severity="success"');
    expect(html).toContain('aria-label="Success"');
  });
});
