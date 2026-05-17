import { describe, expect, test } from "bun:test";
import { renderAssetTags } from "./assets";
import { Layout } from "./Layout";

const render = (node: unknown): string => String(node);

describe("Layout", () => {
  test("renders document chrome and Vite-managed assets", () => {
    const html = render(
      <Layout>
        <main>Body</main>
      </Layout>,
    );

    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("pace-calculator-theme");
    expect(html).toContain("fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
    expect(html).not.toContain("<style>");
    expect(html).not.toContain("https://unpkg.com/htmx.org");
    expect(html).not.toContain("https://unpkg.com/open-props");
    expect(html).toContain("<main>Body</main>");
  });

  test("renders Vite dev server tags", () => {
    const html = render(renderAssetTags({ devServerUrl: "http://localhost:5173/" }));

    expect(html).toContain('type="module"');
    expect(html).toContain('src="http://localhost:5173/@vite/client"');
    expect(html).toContain('src="http://localhost:5173/src/client/main.ts"');
  });

  test("renders Vite manifest tags", () => {
    const html = render(
      renderAssetTags({
        manifest: {
          "src/client/main.ts": {
            css: ["assets/main.css"],
            file: "assets/main.js",
            imports: ["_shared.js"],
          },
          "_shared.js": {
            css: ["assets/shared.css"],
            file: "assets/shared.js",
          },
        },
      }),
    );

    expect(html).toContain('href="/assets/main.css"');
    expect(html).toContain('href="/assets/shared.css"');
    expect(html).toContain('src="/assets/main.js"');
  });
});
