import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
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
import { StatBlock } from "../molecules/StatBlock";
import { StatusSummary } from "../molecules/StatusSummary";
import { StatusSymbol } from "../molecules/StatusSymbol";
import { Tabs } from "../molecules/Tabs";
import { TimelineList } from "../molecules/TimelineList";
import { Toolbar } from "../molecules/Toolbar";
import { ValidationSummary } from "../molecules/ValidationSummary";
import { StagedForm } from "../organisms/StagedForm";
import { renderStory } from "./render";

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
        <div class="storybook-doc__grid">
          <div class="storybook-doc__section">
            <h2 id="shell-preview-heading">Rendered output</h2>
            <AppShell
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
              <dl class="storybook-row">
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
          <div class="storybook-doc__section">
            <h2 id="shell-contract-heading">Contract</h2>
            <ul>
              <li>AppShell owns landmarks and layout slots, not product routing.</li>
              <li>SideNav, Breadcrumbs, and Tabs render native links with current-state hints.</li>
              <li>
                Notice, Progress, LoadingIndicator, and StatusSummary expose state accessibly.
              </li>
              <li>
                The app owns data freshness, permissions, destructive actions, and route names.
              </li>
            </ul>
          </div>
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
      </div>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    await expect(canvas.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open sync dialog" })).toBeInTheDocument();
    await expect(canvas.getByText("Refreshing")).toBeInTheDocument();
  },
};

export const StagedFormWorkflow: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="staged-form-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Sequential organism contract</p>
          <h1 id="staged-form-heading" class="storybook-doc__title">
            Staged form workflow
          </h1>
          <p class="storybook-doc__lede">
            Split long server-rendered forms into ordered stages with the shared organism boundary
            while routes keep validation, dependency rules, persistence, redirects, and HTMX
            fragment responses.
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
            code={`import { Button, ButtonGroup, FormField, HxForm } from "@macavitymadcap/hyper-dank-ui";
import { StagedForm } from "@macavitymadcap/hyper-dank-ui/organisms";

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
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Staged form workflow" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("navigation", { name: "Article setup stages" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
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
        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="content-preview-heading">
            <h2 id="content-preview-heading">Rendered output</h2>
            <Prose>
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
        </div>
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
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Release notes" })).toBeInTheDocument();
    await expect(canvas.getByText("No matching entries")).toBeInTheDocument();
  },
};
