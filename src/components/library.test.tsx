import { describe, expect, test } from "bun:test";
import { Button, Card, FormField, LabelledOutput, ScrollableTable } from "./library";

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
      </Card>,
    );

    expect(html).toContain('class="card"');
    expect(html).toContain('class="form-field"');
    expect(html).toContain('data-variant="outline"');
    expect(html).toContain("3.8");
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
});
