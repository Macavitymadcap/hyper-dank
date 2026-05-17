import { describe, expect, test } from "bun:test";
import {
  Accordion,
  Badge,
  Button,
  CompactList,
  FormField,
  Icon,
  Panel,
  PopoverMenu,
  Switch,
} from "@macavitymadcap/hyper-dank-components";
import { type Migration, runPendingMigrations } from "@macavitymadcap/hyper-dank-database";
import { errorMessage, FormValues, HttpResponder } from "@macavitymadcap/hyper-dank-http";

describe("Character Sheet compatibility", () => {
  test("imports generic components needed by the external character-sheet app", () => {
    const html = String(
      <Panel labelledBy="sheet-heading">
        <h1 id="sheet-heading">Lynott</h1>
        <Badge tone="accent">Player</Badge>
        <Icon label="Inspired" name="workspace_premium" />
        <Switch id="inspiration" label="Inspiration" checked />
        <FormField htmlFor="character-name" label="Character name">
          <input id="character-name" name="characterName" />
        </FormField>
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
        <Button type="submit">Save</Button>
      </Panel>,
    );

    expect(html).toContain("Lynott");
    expect(html).toContain('class="compact-list"');
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
