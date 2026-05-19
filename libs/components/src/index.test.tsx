import { describe, expect, test } from "bun:test";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CheckboxField,
  FormField,
  IconButton,
  LabelledOutput,
  LinkButton,
  Panel,
  PopoverMenu,
  ScrollableTable,
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
      <Panel labelledBy="panel-heading">
        <h2 id="panel-heading">Panel</h2>
        <PopoverMenu id="menu" label="Open menu" items={[{ href: "/", label: "Home" }]} />
      </Panel>,
    );

    expect(html).toContain('class="panel"');
    expect(html).toContain('aria-labelledby="panel-heading"');
    expect(html).toContain('class="popover-menu"');
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
      <Panel labelledBy="filters-heading">
        <h2 id="filters-heading">Filters</h2>
        <ButtonGroup ariaLabel="View actions">
          <IconButton icon="search" label="Search" />
          <LinkButton href="/items" variant="ghost">
            Items
          </LinkButton>
        </ButtonGroup>
        <CheckboxField id="published" label="Published" />
      </Panel>,
    );

    expect(html).toContain('class="button-group"');
    expect(html).toContain('aria-label="Search"');
    expect(html).toContain('class="button link-button"');
    expect(html).toContain('type="checkbox"');
  });
});
