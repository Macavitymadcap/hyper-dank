import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { AppShell } from "../molecules/AppShell";
import { Breadcrumbs } from "../molecules/Breadcrumbs";
import { Callout } from "../molecules/Callout";
import { CodeBlock } from "../molecules/CodeBlock";
import { Dialog } from "../molecules/Dialog";
import { EmptyState } from "../molecules/EmptyState";
import { LoadingIndicator } from "../molecules/LoadingIndicator";
import { MetadataList } from "../molecules/MetadataList";
import { Notice } from "../molecules/Notice";
import { PageHeader } from "../molecules/PageHeader";
import { Pagination } from "../molecules/Pagination";
import { Progress } from "../molecules/Progress";
import { Prose } from "../molecules/Prose";
import { SectionHeader } from "../molecules/SectionHeader";
import { SideNav } from "../molecules/SideNav";
import { StatBlock } from "../molecules/StatBlock";
import { StatusSummary } from "../molecules/StatusSummary";
import { Tabs } from "../molecules/Tabs";
import { TimelineList } from "../molecules/TimelineList";
import { Toolbar } from "../molecules/Toolbar";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Second-wave shared primitives for app shells, navigation, feedback, data display, and content surfaces.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Second Wave Primitives",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ShellNavigationAndFeedback: Story = {
  render: () =>
    renderStory(
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
      </AppShell>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    await expect(canvas.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open sync dialog" })).toBeInTheDocument();
    await expect(canvas.getByText("Refreshing")).toBeInTheDocument();
  },
};

export const ContentAndEmptyStates: Story = {
  render: () =>
    renderStory(
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
        <CodeBlock
          language="ts"
          code={'import { Prose, Callout } from "@macavitymadcap/hyper-dank-ui";'}
        />
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
      </Prose>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Release notes" })).toBeInTheDocument();
    await expect(canvas.getByText("No matching entries")).toBeInTheDocument();
  },
};
