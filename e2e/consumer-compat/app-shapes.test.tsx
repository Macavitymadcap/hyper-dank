import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  buildImagesSection,
  createCommandGate,
  parseGitHubRepo,
  renderVerificationReport,
  run,
  summariseScreenshotTargets,
  updateImagesSection,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";
import {
  buildStaticContentSite,
  createContentNavigation,
  outputPathForContentPage,
  renderAccessibilityStatementMarkdown,
  renderChoiceListMarkdown,
  renderMarkdown,
  rewriteContentUrl,
} from "@macavitymadcap/hyper-dank-automation/content";
import {
  createProviderRegistry,
  type Migration,
  planMigrations,
  type RepositoryContract,
  runPendingMigrations,
} from "@macavitymadcap/hyper-dank-data";
import {
  type RepositoryHarness,
  runRepositoryHarness,
} from "@macavitymadcap/hyper-dank-data/testing";
import {
  errorMessage,
  FormValues,
  HttpResponder,
  isHtmxRequest,
} from "@macavitymadcap/hyper-dank-transport";
import {
  Accordion,
  AppShell,
  Badge,
  BasicGraph,
  Breadcrumbs,
  Button,
  Callout,
  Card,
  CodeBlock,
  CompactList,
  Dialog,
  EmptyState,
  FormField,
  HxForm,
  Icon,
  InputGroup,
  LabelledOutput,
  MetadataList,
  Notice,
  PageHeader,
  Pagination,
  Panel,
  PopoverMenu,
  Progress,
  Prose,
  ScrollableTable,
  SideNav,
  StatBlock,
  StatusSummary,
  Switch,
  TableCell,
  Tabs,
  TimelineList,
  Toolbar,
} from "@macavitymadcap/hyper-dank-ui";

describe("Hyper-Dank recipe compatibility", () => {
  test("renders server-app controls through public component imports", () => {
    const html = String(
      <Panel labelledBy="workspace-heading">
        <h1 id="workspace-heading">Workspace</h1>
        <Badge tone="accent">Active</Badge>
        <Icon label="Verified" name="workspace_premium" />
        <Switch
          id="notifications"
          label="Notifications"
          checked
          variant="compact"
          offIcon="radio_button_unchecked"
          onIcon="bolt"
          hx-post="/settings/notifications"
          hx-target="#workspace-panel"
        />
        <FormField id="display-name" name="displayName" label="Display name" autocomplete="name" />
        <CompactList items={[{ label: "Status", value: "Ready" }]} />
        <Accordion
          name="workspace-sections"
          items={[{ body: "Recent activity", id: "activity", title: "Activity" }]}
        />
        <PopoverMenu
          id="workspace-menu"
          label="Open workspace menu"
          items={[{ href: "/settings", label: "Settings" }]}
        />
        <Button type="submit" variant="ghost">
          Save
        </Button>
      </Panel>,
    );

    expect(html).toContain("Workspace");
    expect(html).toContain('class="compact-list"');
    expect(html).toContain('data-variant="compact"');
    expect(html).toContain('hx-post="/settings/notifications"');
    expect(html).toContain('data-variant="ghost"');
    expect(html).toContain('aria-label="Open workspace menu"');
  });

  test("composes data and transport helpers for server-app routes", async () => {
    const applied: string[] = [];
    const migrations: Migration[] = [{ id: "001", sql: "select 1" }];
    const providers = createProviderRegistry({
      memory: ({ label }: { label: string }) => ({
        close: () => {},
        createRepositories: () => ({}),
        kind: "memory" as const,
        label,
        migrate: () => {},
      }),
    });
    const entries: RepositoryContract<{ id: string; title: string }, string> = {
      delete: () => true,
      findById: (id) => ({ id, title: "Compat" }),
      list: () => [{ id: "entry", title: "Compat" }],
      save: (record) => record,
    };
    const harness: RepositoryHarness<typeof entries> = {
      repository: entries,
    };

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

    const plan = await planMigrations(
      {
        hasMigration: (id) => applied.includes(id),
      },
      migrations,
    );
    const provider = await providers.create("memory", { label: "compat" });
    const title = await runRepositoryHarness(
      () => harness,
      async (repository) => {
        const entry = await repository.findById("entry");
        return entry?.title;
      },
    );
    const form = new FormValues({ email: "user@example.test" });
    const responder = new HttpResponder();

    expect(applied).toEqual(["001"]);
    expect(plan.skipped).toEqual([{ id: "001", reason: "already-applied" }]);
    expect(provider.label).toBe("compat");
    expect(title).toBe("Compat");
    expect(form.string("email")).toBe("user@example.test");
    expect(form.optionalString("email")).toBe("user@example.test");
    expect(new FormValues({ enabled: "on", limit: "5" }).boolean("enabled")).toBe(true);
    expect(new FormValues({ enabled: "on", limit: "5" }).number("limit")).toBe(5);
    expect(errorMessage("unknown")).toBe("Something went wrong.");
    expect(responder).toBeInstanceOf(HttpResponder);
    expect(isHtmxRequest({ "HX-Request": "true" })).toBe(true);
  });
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
      <AppShell
        header={<PageHeader title="Operations" actions={<Button type="button">Refresh</Button>} />}
        navigation={
          <SideNav
            ariaLabel="Admin sections"
            items={[{ current: true, href: "/admin", label: "Admin" }]}
          />
        }
      >
        <Panel labelledBy="dashboard-heading">
          <h2 id="dashboard-heading">Operations</h2>
          <Toolbar ariaLabel="Dashboard tools">
            <Button type="button" variant="ghost">
              Export
            </Button>
          </Toolbar>
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
          <Pagination currentPage={1} totalPages={2} nextHref="/admin?page=2" />
          <StatusSummary items={[{ label: "Checks", tone: "success", value: "Passing" }]} />
          <BasicGraph
            id="dashboard-checks"
            title="Check volume"
            summary="Three checks ran this week."
            data={[
              { label: "Mon", value: 1 },
              { label: "Tue", value: 2 },
              { label: "Wed", value: 3 },
            ]}
          />
        </Panel>
      </AppShell>,
    );

    expect(html).toContain('hx-get="/admin/filter"');
    expect(html).toContain('class="app-shell"');
    expect(html).toContain('class="toolbar"');
    expect(html).toContain('data-scrollable="true"');
    expect(html).toContain('data-action-column="true"');
    expect(html).toContain('class="pagination"');
    expect(html).toContain('class="status-summary"');
    expect(html).toContain('class="basic-graph"');
    expect(html).toContain('aria-labelledby="dashboard-checks-title dashboard-checks-summary"');
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
        <Notice tone="success">Saved</Notice>
        <Dialog
          id="server-dialog"
          title="Server action"
          triggerLabel="Open server action"
          hx-get="/action"
        >
          Confirm action
        </Dialog>
        <Progress label="Import" value={25} />
      </Panel>,
    );

    expect(html).toContain('aria-label="Open actions"');
    expect(html).toContain('action="/logout"');
    expect(html).toContain("<dialog");
    expect(html).toContain('class="notice"');
    expect(html).toContain("<progress");
    expect(html).toContain("Online");
  });

  test("renders docs and content primitives through public component imports", () => {
    const html = String(
      <Prose>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { current: true, href: "/notes", label: "Notes" },
          ]}
        />
        <MetadataList items={[{ label: "Author", value: "Platform" }]} />
        <TimelineList items={[{ label: "Published", time: "2026-05-19" }]} />
        <CodeBlock language="ts" code={"const ready = true;"} />
        <Callout title="Note">Reusable content shell</Callout>
        <EmptyState title="No posts" />
        <dl>
          <StatBlock label="Posts" value="12" />
        </dl>
        <Tabs
          ariaLabel="Content views"
          items={[{ current: true, href: "/notes", label: "Notes" }]}
        />
      </Prose>,
    );

    expect(html).toContain('class="prose"');
    expect(html).toContain('class="breadcrumbs"');
    expect(html).toContain('class="metadata-list"');
    expect(html).toContain('class="timeline-list"');
    expect(html).toContain('class="code-block"');
    expect(html).toContain('class="callout"');
    expect(html).toContain('class="empty-state"');
    expect(html).toContain('class="stat-block"');
    expect(html).toContain('class="tabs"');
  });

  test("imports script helpers with fake inputs and no live services", async () => {
    const repo = parseGitHubRepo("Macavitymadcap/hyper-dank");
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
    const gate = createCommandGate("compat", "Compatibility", "bun", ["test"], "Bun");
    const targets = summariseScreenshotTargets([
      {
        id: "demo",
        label: "Demo",
        description: "Demo flow",
        states: [{ label: "Ready", slug: "ready", path: "/demo" }],
      },
    ]);

    expect(repo).toEqual({ owner: "Macavitymadcap", name: "hyper-dank" });
    expect(images).toContain("demo-ready.png");
    expect(updateImagesSection("Body", images)).toContain("## Images");
    expect(report).toContain("Compatibility");
    expect(run("bun", ["-e", "console.log('compat')"])).toBe("compat");
    expect(await response.text()).toBe("ready");
    expect(gate).toMatchObject({ id: "compat", command: "bun" });
    expect(targets[0]).toMatchObject({ flowId: "demo", path: "/demo" });
  });

  test("builds static-content generator output through the public automation content subpath", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-recipe-"));
    const sourceDir = path.join(tmp, "content");
    const destinationDir = path.join(tmp, "public");

    await mkdir(path.join(sourceDir, "assets"), { recursive: true });
    await writeFile(
      path.join(sourceDir, "index.md"),
      "---\ntitle: Notes\n---\n\n# Notes\n\nRead [docs](/docs/).",
    );
    await writeFile(path.join(sourceDir, "assets/site.css"), "body { color: black; }\n");

    const html = renderMarkdown("# Notes\n\nRead [docs](/docs/).", { basePath: "/hyper-dank" });
    const statement = renderAccessibilityStatementMarkdown({
      contact: "Open an issue.",
      knownLimitations: ["Example limitations are app-owned."],
      siteName: "Example docs",
      statementDate: "2026-05-21",
      supportSummary: "Example docs uses semantic HTML.",
      testing: ["Pa11y checks"],
    });
    const navigation = createContentNavigation(
      [
        { href: "/chapter-1/", label: "Chapter one", order: 1 },
        { href: "/chapter-2/", label: "Chapter two", order: 2 },
      ],
      "/chapter-1/",
    );
    const choices = renderChoiceListMarkdown([
      { href: "/start/", label: "Begin" },
      { href: "/archive/", label: "Read the archive", summary: "Static branch" },
    ]);

    await buildStaticContentSite({
      assets: [{ from: path.join(sourceDir, "assets"), to: "assets" }],
      basePath: "/hyper-dank",
      destinationDir,
      renderDocument: ({ content, page }) =>
        `<!doctype html><title>${page.title}</title>${content}`,
      sourceDir,
    });

    expect(html).toContain('<h1 id="notes">Notes</h1>');
    expect(html).toContain('<a href="/hyper-dank/docs/">docs</a>');
    await expect(readFile(path.join(destinationDir, "index.html"), "utf8")).resolves.toContain(
      '<a href="/hyper-dank/docs/">docs</a>',
    );
    await expect(readFile(path.join(destinationDir, "assets/site.css"), "utf8")).resolves.toContain(
      "body",
    );
    expect(outputPathForContentPage("release-notes.md")).toBe("release-notes/index.html");
    expect(rewriteContentUrl("{{ '/recipes/' | relative_url }}", { basePath: "/hyper-dank" })).toBe(
      "/hyper-dank/recipes/",
    );
    expect(statement).toContain("# Accessibility statement for Example docs");
    expect(navigation.next?.href).toBe("/chapter-2/");
    expect(choices).toContain("[Read the archive](/archive/) — Static branch");
  });
});
