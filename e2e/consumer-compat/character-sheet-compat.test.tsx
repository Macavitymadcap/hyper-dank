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
