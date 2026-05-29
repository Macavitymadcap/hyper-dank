import { describe, expect, test } from "bun:test";
import { AlertDialog } from "./AlertDialog";

const render = (node: unknown): string => String(node);

describe("AlertDialog", () => {
  test("renders a native alert dialog with trigger, fallback, cancel, and confirm action", () => {
    const html = render(
      <AlertDialog
        id="delete-post"
        title="Delete post"
        description="This action cannot be undone."
        triggerLabel="Delete"
        fallbackHref="/posts/1/delete"
        action="/posts/1/delete"
        confirmLabel="Delete post"
        confirmName="intent"
        confirmValue="delete"
      >
        The route owns permission checks, mutation, and redirects.
      </AlertDialog>,
    );

    expect(html).toContain('class="alert-dialog-wrapper"');
    expect(html).toContain('class="button alert-dialog-trigger"');
    expect(html).toContain('data-variant="outline"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-controls="delete-post"');
    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('aria-labelledby="delete-post-title"');
    expect(html).toContain('aria-describedby="delete-post-description"');
    expect(html).toContain('href="/posts/1/delete"');
    expect(html).toContain('action="/posts/1/delete"');
    expect(html).toContain('formmethod="dialog"');
    expect(html).toContain('class="button alert-dialog-confirm"');
    expect(html).toContain('data-variant="danger"');
    expect(html).toContain('name="intent"');
    expect(html).toContain('value="delete"');
  });

  test("passes HTMX attributes to the confirm form", () => {
    const html = render(
      <AlertDialog
        id="archive-post"
        title="Archive post"
        triggerLabel="Archive"
        confirmLabel="Archive"
        hx-post="/posts/1/archive"
        hx-target="#post-row-1"
        hx-swap="outerHTML"
      >
        Archive this post.
      </AlertDialog>,
    );

    expect(html).toContain('hx-post="/posts/1/archive"');
    expect(html).toContain('hx-target="#post-row-1"');
    expect(html).toContain('hx-swap="outerHTML"');
  });

  test("can render a non-danger confirm variant", () => {
    const html = render(
      <AlertDialog
        id="restore-post"
        title="Restore post"
        triggerLabel="Restore"
        confirmLabel="Restore"
        tone="default"
      >
        Restore this post.
      </AlertDialog>,
    );

    expect(html).toContain('data-variant="primary"');
  });

  test("serializes the trigger target id as a JavaScript string literal", () => {
    const html = render(
      <AlertDialog
        id={`x');alert(1);//`}
        title="Delete"
        triggerLabel="Delete"
        confirmLabel="Delete"
      >
        Body
      </AlertDialog>,
    );

    expect(html).toContain("document.getElementById(&quot;x&#39;);alert(1);//&quot;)?.showModal()");
    expect(html).not.toContain("document.getElementById(&#39;x&#39;);alert(1);//");
  });
});
