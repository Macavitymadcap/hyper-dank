import { describe, expect, test } from "bun:test";
import {
  AlertDialog,
  AppShell,
  AspectRatio,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Callout,
  Card,
  CheckboxField,
  Combobox,
  Command,
  Container,
  DateField,
  Dialog,
  Drawer,
  EmptyState,
  FileField,
  FormField,
  Grid,
  Heading,
  IconButton,
  Kbd,
  LabelledOutput,
  Link,
  LinkButton,
  Notice,
  NotificationBanner,
  NumberField,
  PageHeader,
  Pagination,
  Panel,
  PopoverMenu,
  Prose,
  RangeField,
  ScrollableTable,
  Separator,
  SideNav,
  Skeleton,
  Stack,
  StagedForm,
  StatBlock,
  StatusSymbol,
  TableFilterSummary,
  Tabs,
  Text,
  Toolbar,
  Tooltip,
  VisuallyHidden,
} from "./index";

const render = (node: unknown): string => String(node);

describe("component library", () => {
  test("exports generic atoms and molecules from a stable boundary", () => {
    const html = render(
      <Card>
        <FormField htmlFor="distance" label="Distance">
          <input id="distance" name="distance" />
        </FormField>
        <Button type="button" variant="outline">
          Save
        </Button>
        <LabelledOutput label="Avg mph" value={3.8} />
        <Badge>Ready</Badge>
      </Card>,
    );

    expect(html).toContain('class="card"');
    expect(html).toContain('class="form-field"');
    expect(html).toContain('data-variant="outline"');
    expect(html).toContain("3.8");
  });

  test("exports app-builder generic primitives", () => {
    const html = render(
      <Panel ariaLabelledBy="panel-heading">
        <h2 id="panel-heading">Panel</h2>
        <PopoverMenu id="menu" label="Open menu" items={[{ href: "/", label: "Home" }]} />
      </Panel>,
    );

    expect(html).toContain('class="panel"');
    expect(html).toContain('aria-labelledby="panel-heading"');
    expect(html).toContain('class="popover-menu"');
  });

  test("exports low-state utility primitives", () => {
    const html = render(
      <Panel ariaLabelledBy="low-state-heading">
        <h2 id="low-state-heading">Low state</h2>
        <Tooltip id="save-tip" label="Save" content="Save this draft" />
        <Skeleton width="8rem" />
        <Separator />
        <Kbd>Esc</Kbd>
        <Avatar name="Ada Lovelace" />
        <AspectRatio ratio="4 / 3">
          <img src="/preview.png" alt="Preview" />
        </AspectRatio>
      </Panel>,
    );

    expect(html).toContain('class="tooltip"');
    expect(html).toContain('class="skeleton"');
    expect(html).toContain('class="separator"');
    expect(html).toContain('class="kbd"');
    expect(html).toContain('class="avatar"');
    expect(html).toContain('class="aspect-ratio"');
  });

  test("exports layout and typography utility primitives", () => {
    const html = render(
      <Container as="main" ariaLabelledBy="utilities-heading" width="narrow">
        <Stack gap="1rem">
          <Heading id="utilities-heading" level={1} visualLevel={2}>
            Utilities
          </Heading>
          <Text tone="muted">Small composition helpers.</Text>
          <Grid minColumnWidth="12rem">
            <Link href="/docs" current>
              Docs
            </Link>
            <VisuallyHidden>Visible to assistive technology</VisuallyHidden>
          </Grid>
        </Stack>
      </Container>,
    );

    expect(html).toContain('class="container"');
    expect(html).toContain('data-width="narrow"');
    expect(html).toContain('class="stack"');
    expect(html).toContain('class="heading"');
    expect(html).toContain('class="text"');
    expect(html).toContain('class="grid"');
    expect(html).toContain('class="link"');
    expect(html).toContain('class="visually-hidden"');
  });

  test("keeps table primitives app-agnostic", () => {
    const html = render(
      <ScrollableTable
        columns={[{ key: "name", header: "Name" }]}
        columnsTemplate="1fr"
        rowClassName="sample-row"
      >
        <tr class="sample-row">
          <td>Example</td>
        </tr>
      </ScrollableTable>,
    );

    expect(html).toContain('class="scrollable-table"');
    expect(html).toContain("Name");
    expect(html).toContain("Example");
  });

  test("exports app-builder action and form primitives", () => {
    const html = render(
      <Panel ariaLabelledBy="filters-heading">
        <h2 id="filters-heading">Filters</h2>
        <ButtonGroup ariaLabel="View actions">
          <IconButton icon="search" label="Search" />
          <LinkButton href="/items" variant="ghost">
            Items
          </LinkButton>
        </ButtonGroup>
        <CheckboxField id="published" label="Published" />
        <Combobox id="owner" label="Owner" options={[{ label: "Ada Lovelace", value: "Ada" }]} />
        <Command
          id="command"
          label="Command"
          items={[{ href: "/items?status=ready", label: "Ready items", value: "ready" }]}
        />
      </Panel>,
    );

    expect(html).toContain('class="button-group"');
    expect(html).toContain('aria-label="Search"');
    expect(html).toContain('class="button link-button"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('class="form-field combobox"');
    expect(html).toContain('class="command"');
  });

  test("exports native-first expanded field primitives", () => {
    const html = render(
      <Panel ariaLabelledBy="field-heading">
        <h2 id="field-heading">Fields</h2>
        <NumberField id="quantity" label="Quantity" min={1} step={1} />
        <DateField id="due-date" label="Due date" />
        <FileField id="attachment" label="Attachment" accept=".csv" />
        <RangeField id="confidence" label="Confidence" value={75} valueLabel="75%" />
      </Panel>,
    );

    expect(html).toContain('class="form-field number-field"');
    expect(html).toContain('type="number"');
    expect(html).toContain('class="form-field date-field"');
    expect(html).toContain('type="date"');
    expect(html).toContain('class="form-field file-field"');
    expect(html).toContain('type="file"');
    expect(html).toContain('class="form-field range-field"');
    expect(html).toContain('type="range"');
  });

  test("exports second-wave layout and navigation primitives", () => {
    const html = render(
      <AppShell
        header={<PageHeader title="Dashboard" actions={<LinkButton href="/new">New</LinkButton>} />}
        navigation={
          <SideNav
            ariaLabel="Sections"
            items={[{ current: true, href: "/dashboard", label: "Dashboard" }]}
          />
        }
      >
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { current: true, label: "Dashboard" },
          ]}
        />
        <Toolbar ariaLabel="Tools">
          <IconButton icon="filter" label="Filter" />
          <AlertDialog
            id="delete-item"
            title="Delete item"
            triggerLabel="Delete"
            confirmLabel="Delete"
          >
            Delete this item.
          </AlertDialog>
          <Drawer id="mobile-sections" title="Sections" triggerLabel="Open sections">
            Mobile section links.
          </Drawer>
        </Toolbar>
        <Tabs
          ariaLabel="Views"
          items={[{ current: true, href: "/dashboard", label: "Overview" }]}
        />
        <Pagination currentPage={1} totalPages={3} nextHref="/dashboard?page=2" />
      </AppShell>,
    );

    expect(html).toContain('class="app-shell"');
    expect(html).toContain('class="page-header"');
    expect(html).toContain('class="side-nav"');
    expect(html).toContain('<span aria-current="page">Dashboard</span>');
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('class="drawer"');
    expect(html).toContain('class="pagination"');
  });

  test("exports second-wave feedback, data, and content primitives", () => {
    const html = render(
      <Prose>
        <Notice tone="success">Saved</Notice>
        <NotificationBanner severity="info" title="Sync queued">
          The import will run shortly.
        </NotificationBanner>
        <p>
          <StatusSymbol label="Ready" status="success" /> Ready
        </p>
        <Dialog id="details" title="Details" triggerLabel="Open details">
          More
        </Dialog>
        <EmptyState title="No results" />
        <dl>
          <StatBlock label="Posts" value="12" />
        </dl>
        <TableFilterSummary
          activeFilters={[{ label: "Status", value: "Published" }]}
          resultCount={12}
        />
        <Callout>Remember this</Callout>
        <StagedForm
          currentStepId="details"
          steps={[
            { id: "basics", label: "Basics", status: "complete" },
            { id: "details", label: "Details" },
          ]}
        >
          Step fields
        </StagedForm>
      </Prose>,
    );

    expect(html).toContain('class="prose"');
    expect(html).toContain('class="notice"');
    expect(html).toContain('class="notification-banner"');
    expect(html).toContain('class="status-symbol"');
    expect(html).toContain("<dialog");
    expect(html).toContain('class="empty-state"');
    expect(html).toContain('class="stat-block"');
    expect(html).toContain('class="table-filter-summary"');
    expect(html).toContain('class="callout"');
    expect(html).toContain('class="staged-form"');
  });
});
