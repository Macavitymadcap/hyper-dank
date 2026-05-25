import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { AppShell } from "../molecules/AppShell";
import { Breadcrumbs } from "../molecules/Breadcrumbs";
import { ButtonGroup } from "../molecules/ButtonGroup";
import { Callout } from "../molecules/Callout";
import { CodeBlock } from "../molecules/CodeBlock";
import { Dialog } from "../molecules/Dialog";
import { EmptyState } from "../molecules/EmptyState";
import { Fieldset } from "../molecules/Fieldset";
import { FormField } from "../molecules/FormField";
import { HxForm } from "../molecules/HxForm";
import { LoadingIndicator } from "../molecules/LoadingIndicator";
import { MetadataList } from "../molecules/MetadataList";
import { Notice } from "../molecules/Notice";
import { NotificationBanner } from "../molecules/NotificationBanner";
import { PageHeader } from "../molecules/PageHeader";
import { Pagination } from "../molecules/Pagination";
import { Progress } from "../molecules/Progress";
import { Prose } from "../molecules/Prose";
import { SectionHeader } from "../molecules/SectionHeader";
import { SideNav } from "../molecules/SideNav";
import { StagedForm } from "../molecules/StagedForm";
import { StatBlock } from "../molecules/StatBlock";
import { StatusSummary } from "../molecules/StatusSummary";
import { StatusSymbol } from "../molecules/StatusSymbol";
import { Tabs } from "../molecules/Tabs";
import { TimelineList } from "../molecules/TimelineList";
import { Toolbar } from "../molecules/Toolbar";
import { ValidationSummary } from "../molecules/ValidationSummary";
import { ComponentReference } from "./component-reference";
import { renderStory, renderStoryWithActions } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Shared primitives for app shells, navigation, feedback, data display, and content surfaces.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/App Surfaces And Feedback",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ShellNavigationAndFeedback: Story = {
  render: () =>
    renderStory(
      <div class="storybook-doc">
        <div class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Shell, navigation, and feedback contract</p>
          <h1 id="shell-heading" class="storybook-doc__title">
            Shell navigation and feedback
          </h1>
          <p class="storybook-doc__lede">
            Use this set for dense app screens that need landmarks, local navigation, status
            feedback, paging, and compact operational metrics.
          </p>
        </div>
        <div class="storybook-doc__grid storybook-doc__grid--contract-stack">
          <div class="storybook-doc__section storybook-doc__section--roomy">
            <h2 id="shell-preview-heading">Rendered output</h2>
            <AppShell
              className="storybook-demo-shell"
              header={
                <PageHeader
                  title="Dashboard"
                  description="Operational summary built from shared primitives."
                  metadata={<Badge tone="accent">Live</Badge>}
                  actions={<Button>Refresh</Button>}
                />
              }
              navigation={
                <SideNav
                  ariaLabel="Sections"
                  items={[
                    { current: true, href: "/dashboard", label: "Dashboard" },
                    { href: "/content", label: "Content" },
                  ]}
                />
              }
            >
              <Breadcrumbs
                items={[
                  { href: "/", label: "Home" },
                  { current: true, href: "/dashboard", label: "Dashboard" },
                ]}
              />
              <Tabs
                ariaLabel="Dashboard views"
                items={[
                  { current: true, href: "/dashboard", label: "Overview" },
                  { href: "/activity", label: "Activity" },
                ]}
              />
              <Toolbar ariaLabel="Dashboard tools">
                <Button variant="ghost">Filter</Button>
                <Dialog id="confirm-sync" title="Sync data" triggerLabel="Open sync dialog">
                  Sync latest records from the server.
                </Dialog>
              </Toolbar>
              <Notice tone="success" heading="Saved">
                Settings were updated.
              </Notice>
              <dl class="storybook-row storybook-row--roomy">
                <StatBlock label="Posts" value="24" meta="Published" />
                <StatBlock label="Drafts" value="4" trend="+2 this week" />
              </dl>
              <StatusSummary
                title="Verification"
                items={[
                  { label: "Build", tone: "success", value: "Passed" },
                  { label: "A11y", tone: "success", value: "No issues" },
                ]}
              />
              <Progress label="Import progress" value={60} />
              <LoadingIndicator label="Refreshing" />
              <Pagination currentPage={1} totalPages={4} nextHref="/dashboard?page=2" />
            </AppShell>
          </div>
          <div class="storybook-doc__aside-stack">
            <div class="storybook-doc__section">
              <h2 id="shell-contract-heading">Contract</h2>
              <ul>
                <li>AppShell owns landmarks and layout slots, not product routing.</li>
                <li>
                  SideNav, Breadcrumbs, and Tabs render native links with current-state hints.
                </li>
                <li>
                  Notice, Progress, LoadingIndicator, and StatusSummary expose state accessibly.
                </li>
                <li>
                  The app owns data freshness, permissions, destructive actions, and route names.
                </li>
              </ul>
            </div>
            <CodeBlock
              language="tsx"
              code={`import { AppShell, PageHeader, SideNav, Notice } from "@macavitymadcap/hyper-dank-ui";

export function DashboardShell() {
  return (
    <AppShell
      header={<PageHeader title="Dashboard" description="Operational summary." />}
      navigation={<SideNav ariaLabel="Sections" items={[{ current: true, href: "/dashboard", label: "Dashboard" }]} />}
    >
      <Notice tone="success" heading="Saved">Settings were updated.</Notice>
    </AppShell>
  );
}`}
            />
            <ComponentReference
              id="shell-reference"
              sections={{
                Purpose: [
                  "Compose dense app screens with shared landmarks, local navigation, feedback, pagination, and operational status.",
                  "Keep the app shell generic enough for dashboards, admin tools, and docs-like app surfaces.",
                ],
                "Inputs and slots": [
                  "AppShell accepts header, navigation, children, and optional footer slots.",
                  "PageHeader, SideNav, Breadcrumbs, Tabs, Toolbar, Notice, StatusSummary, Progress, LoadingIndicator, and Pagination each receive app-provided labels, routes, and state.",
                ],
                "Rendered output": [
                  "The shell renders a header landmark, optional navigation aside, and main content region.",
                  "Navigation and paging remain link-backed, while local feedback and progress use semantic sections and native progress output.",
                ],
                Accessibility: [
                  "SideNav, Breadcrumbs, Tabs, Toolbar, and Pagination expose labels or current-state hints.",
                  "Notice, StatusSummary, Progress, and LoadingIndicator expose status text without depending on colour alone.",
                ],
                "App-owned behaviour": [
                  "Apps own routing, permissions, data freshness, destructive actions, pagination data, sync timing, and mutations.",
                  "HTMX enhancement, polling, and refresh behaviour should be wired by the consuming route.",
                ],
                "CSS hooks": [
                  ".app-shell, .app-shell-body, .app-shell-navigation, .app-shell-main, .page-header, .side-nav, .tabs, .toolbar, .notice, .status-summary, .progress, .loading-indicator, and .pagination.",
                  "The Storybook preview adds demo-only layout helpers; consuming apps should layer product layout after the package CSS.",
                ],
              }}
            />
          </div>
        </div>
      </div>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    await expect(canvas.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open sync dialog" })).toBeInTheDocument();
    await expect(canvas.getByText("Refreshing")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Refresh" }));
    await userEvent.click(canvas.getByRole("button", { name: "Filter" }));
    await userEvent.click(canvas.getByRole("button", { name: "Open sync dialog" }));
    await expect(canvas.getByText("Sync latest records from the server.")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
  },
};

export const StagedFormWorkflow: Story = {
  render: () =>
    renderStoryWithActions(
      <article class="storybook-doc" aria-labelledby="staged-form-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Sequential form contract</p>
          <h1 id="staged-form-heading" class="storybook-doc__title">
            Staged form workflow
          </h1>
          <p class="storybook-doc__lede">
            Split long server-rendered forms into ordered stages while routes keep validation,
            dependency rules, persistence, redirects, and HTMX fragment responses.
          </p>
        </header>
        <div class="storybook-doc__grid storybook-doc__grid--two">
          <section class="storybook-doc__section" aria-labelledby="staged-form-preview-heading">
            <h2 id="staged-form-preview-heading">Rendered output</h2>
            <HxForm
              action="/articles/new"
              method="post"
              hx-post="/articles/new/stage"
              hx-target="#article-stages"
              hx-swap="outerHTML"
            >
              <StagedForm
                id="article-stages"
                heading="Article setup"
                progressLabel="Article setup stages"
                currentStepId="content"
                steps={[
                  {
                    id: "basics",
                    label: "Basics",
                    description: "Title and owner.",
                    status: "complete",
                    href: "/articles/new?stage=basics",
                    "hx-get": "/articles/new?stage=basics",
                    "hx-target": "#article-stages",
                  },
                  {
                    id: "content",
                    label: "Content",
                    description: "Body copy unlocks review.",
                    status: "error",
                  },
                  {
                    id: "review",
                    label: "Review",
                    description: "Unavailable until content is valid.",
                    status: "unavailable",
                  },
                ]}
                validation={
                  <ValidationSummary
                    items={[{ href: "#article-body", message: "Add body copy before review." }]}
                  />
                }
                actions={
                  <ButtonGroup ariaLabel="Article stage actions">
                    <Button type="submit" name="stage" value="basics" variant="outline">
                      Back
                    </Button>
                    <Button type="submit" name="stage" value="review">
                      Continue
                    </Button>
                  </ButtonGroup>
                }
              >
                <Fieldset
                  legend="Content"
                  description="The route decides whether this stage can move to review."
                >
                  <FormField id="article-body" label="Body" name="body" error="Add body copy." />
                </Fieldset>
              </StagedForm>
            </HxForm>
          </section>
          <section class="storybook-doc__section" aria-labelledby="staged-form-contract-heading">
            <h2 id="staged-form-contract-heading">Contract</h2>
            <ul>
              <li>
                Steps are app-provided state: complete, current, available, unavailable, or error.
              </li>
              <li>
                Step links can use native URLs and optional HTMX attributes for fragment swaps.
              </li>
              <li>Panels compose Fieldset, FormField, ValidationSummary, HxForm, and buttons.</li>
              <li>
                The component does not own schemas, branching rules, saves, permissions, or
                redirects.
              </li>
            </ul>
          </section>
          <CodeBlock
            className="storybook-doc__section storybook-doc__section--span-all"
            language="tsx"
            code={`import { Button, ButtonGroup, FormField, HxForm, StagedForm } from "@macavitymadcap/hyper-dank-ui";

export function ArticleStage({ stage }) {
  return (
    <HxForm action="/articles/new" method="post" hx-post="/articles/new/stage" hx-target="#article-stages">
      <StagedForm
        id="article-stages"
        currentStepId={stage}
        steps={[
          { id: "basics", label: "Basics", status: "complete", href: "/articles/new?stage=basics" },
          { id: "content", label: "Content", status: "current" },
          { id: "review", label: "Review", status: "unavailable" },
        ]}
        actions={<ButtonGroup ariaLabel="Stage actions"><Button type="submit">Continue</Button></ButtonGroup>}
      >
        <FormField id="body" label="Body" name="body" />
      </StagedForm>
    </HxForm>
  );
}`}
          />
        </div>
      </article>,
      { size: "full" },
      [{ event: "submit", handler: () => undefined, preventDefault: true, selector: "form" }],
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Staged form workflow" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("navigation", { name: "Article setup stages" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
  },
};

export const StatusAndNotifications: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="status-notifications-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Status and notification contract</p>
          <h1 id="status-notifications-heading" class="storybook-doc__title">
            Status and notifications
          </h1>
          <p class="storybook-doc__lede">
            Use the shared severity vocabulary to combine text, role, colour, and shape. Apps own
            notification timing, queueing, dismissal, persistence, and delivery rules.
          </p>
        </header>
        <div class="storybook-doc__grid storybook-doc__grid--two">
          <section class="storybook-doc__section" aria-labelledby="notification-preview-heading">
            <h2 id="notification-preview-heading">Rendered output</h2>
            <NotificationBanner severity="info" title="Sync scheduled">
              The static export will refresh after the current deploy.
            </NotificationBanner>
            <NotificationBanner severity="success" title="Published">
              The package reference is live and ready for consumers.
            </NotificationBanner>
            <NotificationBanner severity="warning" title="Review needed">
              Check the accessibility contact copy before release.
            </NotificationBanner>
            <NotificationBanner severity="danger" title="Publication blocked">
              Resolve the failing verification gate before approving.
            </NotificationBanner>
          </section>
          <section class="storybook-doc__section" aria-labelledby="status-model-heading">
            <h2 id="status-model-heading">Feedback hierarchy</h2>
            <ul>
              <li>
                <StatusSymbol decorative status="info" /> Info: neutral guidance or background
                process state.
              </li>
              <li>
                <StatusSymbol decorative status="success" /> Success: complete, saved, published, or
                verified.
              </li>
              <li>
                <StatusSymbol decorative status="warning" /> Warning: user attention needed without
                destructive urgency.
              </li>
              <li>
                <StatusSymbol decorative status="danger" /> Danger: blocked, failed, destructive, or
                security-sensitive.
              </li>
              <li>
                Use Notice for local page feedback, and NotificationBanner for page-level events.
              </li>
              <li>StatusSummary and Badge remain compact dashboard metadata patterns.</li>
              <li>
                ValidationSummary owns form errors; Progress and LoadingIndicator own async work.
              </li>
              <li>
                Toast regions should stay static landmarks unless an app owns queue behaviour.
              </li>
            </ul>
          </section>
          <CodeBlock
            className="storybook-doc__section storybook-doc__section--span-all"
            language="tsx"
            code={`import { NotificationBanner, StatusSymbol } from "@macavitymadcap/hyper-dank-ui";

export function PublicationFeedback() {
  return (
    <>
      <NotificationBanner severity="warning" title="Review needed">
        Check the accessibility contact copy before release.
      </NotificationBanner>
      <p>
        <StatusSymbol label="Verification passed" status="success" /> Verification passed
      </p>
    </>
  );
}`}
          />
        </div>
      </article>,
      { size: "full" },
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Status and notifications" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("alert", { name: "Warning" })).toBeInTheDocument();
    await expect(canvas.getByRole("alert", { name: "Danger" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("status")).toHaveLength(2);
  },
};

export const ContentAndEmptyStates: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="content-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Content and empty-state contract</p>
          <h1 id="content-heading" class="storybook-doc__title">
            Content and empty states
          </h1>
          <p class="storybook-doc__lede">
            Use these primitives for static docs, release notes, timelines, callouts, and blank
            states that need clear structure without taking over content modelling.
          </p>
        </header>
        <div class="storybook-doc__grid storybook-doc__grid--contract-stack">
          <section
            class="storybook-doc__section storybook-doc__section--roomy"
            aria-labelledby="content-preview-heading"
          >
            <h2 id="content-preview-heading">Rendered output</h2>
            <Prose className="storybook-demo-content">
              <SectionHeader
                title="Release notes"
                description="Content primitives for docs and static blogs."
              />
              <MetadataList
                items={[
                  { label: "Author", value: "Platform" },
                  { label: "Status", value: "Published" },
                ]}
              />
              <Callout title="Heads up" tone="info">
                Content layout stays app-owned; these components provide semantic wrappers.
              </Callout>
              <TimelineList
                items={[
                  { label: "Drafted", time: "2026-05-18" },
                  { label: "Published", time: "2026-05-19", body: "Available to consuming apps." },
                ]}
              />
              <EmptyState
                title="No matching entries"
                icon={<Icon name="search" />}
                actions={<Button>Reset filters</Button>}
              >
                Try a broader search.
              </EmptyState>
            </Prose>
          </section>
          <div class="storybook-doc__aside-stack">
            <section class="storybook-doc__section" aria-labelledby="content-contract-heading">
              <h2 id="content-contract-heading">Contract</h2>
              <ul>
                <li>Prose and SectionHeader establish readable content hierarchy.</li>
                <li>
                  MetadataList and TimelineList render structured records with labels and times.
                </li>
                <li>Callout and EmptyState expose tone, title, body, icon, and actions clearly.</li>
                <li>
                  The app owns content collections, filtering, search state, and empty-state copy.
                </li>
              </ul>
            </section>
            <CodeBlock
              language="tsx"
              code={`import { Button, EmptyState, Icon, Prose, SectionHeader } from "@macavitymadcap/hyper-dank-ui";

export function EmptySearchResults() {
  return (
    <Prose>
      <SectionHeader title="Release notes" description="Content primitives for docs and static blogs." />
      <EmptyState title="No matching entries" icon={<Icon name="search" />} actions={<Button>Reset filters</Button>}>
        Try a broader search.
      </EmptyState>
    </Prose>
  );
}`}
            />
            <ComponentReference
              id="content-reference"
              sections={{
                Purpose: [
                  "Give docs, release notes, timelines, callouts, metadata, and empty states a shared semantic base.",
                  "Support static content surfaces without taking over editorial layout or content modelling.",
                ],
                "Inputs and slots": [
                  "Prose receives children, while SectionHeader accepts title, description, and action slots.",
                  "MetadataList, TimelineList, Callout, and EmptyState receive app-authored labels, body copy, tone, icons, and actions.",
                ],
                "Rendered output": [
                  "Prose wraps article content, SectionHeader renders a readable heading cluster, and metadata/timeline primitives use structured list markup.",
                  "Callout and EmptyState render bounded content regions with optional icon and action slots.",
                ],
                Accessibility: [
                  "Headings establish a navigable content hierarchy.",
                  "EmptyState actions remain normal controls, while metadata and timeline records retain explicit labels and times.",
                ],
                "App-owned behaviour": [
                  "Apps own content collections, routes, search/filter state, empty-state copy, action outcomes, and publication workflow.",
                  "The components do not fetch content, infer editorial status, or manage filters.",
                ],
                "CSS hooks": [
                  ".prose, .section-header, .metadata-list, .callout, .timeline-list, and .empty-state.",
                  "Use app CSS for article rhythm, collection layout, and brand-specific content styling.",
                ],
              }}
            />
          </div>
        </div>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Release notes" })).toBeInTheDocument();
    await expect(canvas.getByText("No matching entries")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Reset filters" }));
  },
};
