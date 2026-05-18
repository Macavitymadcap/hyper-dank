import { describe, expect, test } from "bun:test";
import {
  Accordion,
  Badge,
  Button,
  Card,
  CompactList,
  FormField,
  HxForm,
  Icon,
  InputGroup,
  LabelledOutput,
  Panel,
  PopoverMenu,
  ScrollableTable,
  Switch,
  TableCell,
} from "@macavitymadcap/hyper-dank-components";
import { type Migration, runPendingMigrations } from "@macavitymadcap/hyper-dank-database";
import { errorMessage, FormValues, HttpResponder } from "@macavitymadcap/hyper-dank-http";
import {
  buildImagesSection,
  parseGitHubRepo,
  renderVerificationReport,
  run,
  updateImagesSection,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-scripts";

describe("Character Sheet compatibility", () => {
  test("imports generic components needed by the external character-sheet app", () => {
    const html = String(
      <Panel labelledBy="sheet-heading">
        <h1 id="sheet-heading">Lynott</h1>
        <Badge tone="accent">Player</Badge>
        <Icon label="Inspired" name="workspace_premium" />
        <Switch
          id="inspiration"
          label="Inspiration"
          checked
          variant="compact"
          offIcon="radio_button_unchecked"
          onIcon="bolt"
          hx-post="/characters/lynott/inspiration"
          hx-target="#sheet"
        />
        <FormField
          id="character-name"
          name="characterName"
          label="Character name"
          autocomplete="name"
        />
        <CompactList items={[{ label: "Armour Class", value: "18" }]} />
        <Accordion
          name="features"
          items={[{ body: "Arcane Firearm", id: "feature", title: "Feature" }]}
        />
        <PopoverMenu
          id="sheet-menu"
          label="Open sheet menu"
          items={[{ href: "/sheet/lynott", label: "Sheet" }]}
        />
        <Button type="submit" variant="ghost">
          Save
        </Button>
      </Panel>,
    );

    expect(html).toContain("Lynott");
    expect(html).toContain('class="compact-list"');
    expect(html).toContain('data-variant="compact"');
    expect(html).toContain('hx-post="/characters/lynott/inspiration"');
    expect(html).toContain('data-variant="ghost"');
    expect(html).toContain('aria-label="Open sheet menu"');
  });

  test("imports generic database and HTTP primitives", async () => {
    const applied: string[] = [];
    const migrations: Migration[] = [{ id: "001", sql: "select 1" }];

    await runPendingMigrations(
      {
        hasMigration: (id) => applied.includes(id),
        recordMigration: (id) => {
          applied.push(id);
        },
        runMigration: () => {},
      },
      migrations,
    );

    const form = new FormValues({ email: "lynott@example.local" });
    const responder = new HttpResponder();

    expect(applied).toEqual(["001"]);
    expect(form.string("email")).toBe("lynott@example.local");
    expect(errorMessage("unknown")).toBe("Something went wrong.");
    expect(responder).toBeInstanceOf(HttpResponder);
  });
});

describe("Hyper-Dank app-shape compatibility", () => {
  test("renders a static blog composition through public component imports", () => {
    const html = String(
      <Card as="article" className="blog-entry" radius="6px">
        <Panel labelledBy="article-title">
          <h1 id="article-title">Release notes</h1>
          <Badge tone="neutral">Platform</Badge>
          <CompactList
            items={[
              { label: "Published", value: "18 May 2026" },
              { label: "Reading time", value: "4 min" },
            ]}
          />
          <Button type="button" variant="ghost">
            Back to notes
          </Button>
        </Panel>
      </Card>,
    );

    expect(html).toContain("<article");
    expect(html).toContain("Release notes");
    expect(html).toContain('class="compact-list"');
    expect(html).toContain('data-variant="ghost"');
  });

  test("renders a dashboard/admin composition with table and filters", () => {
    const html = String(
      <Card as="main" fill>
        <Panel labelledBy="dashboard-heading">
          <h1 id="dashboard-heading">Operations</h1>
          <HxForm
            action="/admin/filter"
            method="get"
            hx-get="/admin/filter"
            hx-target="#dashboard-results"
          >
            <FormField id="query" name="query" label="Search" />
            <Button type="submit">Filter</Button>
          </HxForm>
          <ScrollableTable
            columns={[
              { key: "name", header: "Name", width: "minmax(10rem, 1fr)" },
              { key: "status", header: "Status", width: "8rem" },
              { key: "actions", header: "Actions", isAction: true, width: "6rem" },
            ]}
            isScrollable
          >
            <tr className="scrollable-table-row">
              <TableCell value="Build checks" />
              <TableCell value="Passing" />
              <TableCell value="Open" />
            </tr>
          </ScrollableTable>
        </Panel>
      </Card>,
    );

    expect(html).toContain('hx-get="/admin/filter"');
    expect(html).toContain('data-scrollable="true"');
    expect(html).toContain('data-action-column="true"');
    expect(html).toContain("Build checks");
    expect(html).toContain("Passing");
  });

  test("renders a static demo composition without server-only assumptions", () => {
    const html = String(
      <Panel labelledBy="demo-heading">
        <h1 id="demo-heading">Static demo</h1>
        <InputGroup type="number" name="miles" label="Miles" min={0} step={0.1} placeholder="1.2" />
        <LabelledOutput label="Average speed" value={3.8} />
        <Button type="button" name="action" value="local-add">
          Add
        </Button>
      </Panel>,
    );

    expect(html).toContain("Static demo");
    expect(html).toContain('type="number"');
    expect(html).toContain("3.8");
    expect(html).toContain('value="local-add"');
  });

  test("renders a server-app composition with progressive actions", () => {
    const html = String(
      <Panel labelledBy="server-heading">
        <h1 id="server-heading">Server app</h1>
        <PopoverMenu
          id="server-actions"
          label="Open actions"
          items={[
            { href: "/settings", label: "Settings" },
            { href: "/logout", label: "Sign out", method: "post" },
          ]}
        />
        <Accordion
          name="server-status"
          items={[{ id: "health", title: "Health", body: <Badge tone="accent">Online</Badge> }]}
        />
      </Panel>,
    );

    expect(html).toContain('aria-label="Open actions"');
    expect(html).toContain('action="/logout"');
    expect(html).toContain("Online");
  });

  test("imports script helpers with fake inputs and no live services", async () => {
    const repo = parseGitHubRepo("Macavitymadcap/pace-calculator");
    const images = buildImagesSection({
      branch: "compat",
      repo,
      flows: [{ id: "demo", label: "Demo", states: [{ label: "Ready", slug: "ready" }] }],
      screenshots: [
        {
          flowId: "demo",
          flowLabel: "Demo",
          label: "Ready",
          relativePath: "docs/pr-screenshots/demo-ready.png",
          stateSlug: "ready",
          theme: "light",
        },
      ],
    });
    const report = renderVerificationReport(
      [
        {
          id: "compat",
          name: "Compatibility",
          tooling: "Bun",
          command: "bun",
          args: ["test"],
          status: "pass",
          stdout: "ok",
          stderr: "",
          exitCode: 0,
        },
      ],
      "/tmp/hyper-dank-consumer",
    );
    const response = await waitForHttp("http://example.test", {
      attempts: 1,
      fetchImpl: async () => new Response("ready"),
    });

    expect(repo).toEqual({ owner: "Macavitymadcap", name: "pace-calculator" });
    expect(images).toContain("demo-ready.png");
    expect(updateImagesSection("Body", images)).toContain("## Images");
    expect(report).toContain("Compatibility");
    expect(run("bun", ["-e", "console.log('compat')"])).toBe("compat");
    expect(await response.text()).toBe("ready");
  });
});
