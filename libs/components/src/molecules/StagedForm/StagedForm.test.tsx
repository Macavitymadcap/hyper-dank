import { describe, expect, test } from "bun:test";
import { Button } from "../../atoms/Button";
import { ButtonGroup } from "../ButtonGroup";
import { Fieldset } from "../Fieldset";
import { FormField } from "../FormField";
import { HxForm } from "../HxForm";
import { ValidationSummary } from "../ValidationSummary";
import { StagedForm } from "./StagedForm";

const render = (node: unknown): string => String(node);

describe("StagedForm", () => {
  test("renders accessible progress, current panel, validation, and route-owned actions", () => {
    const html = render(
      <HxForm action="/publish" method="post" id="publish-form" hx-post="/publish/stage">
        <StagedForm
          id="publish-stages"
          heading="Publish article"
          currentStepId="content"
          steps={[
            { id: "basics", label: "Basics", status: "complete", href: "/publish/basics" },
            {
              id: "content",
              label: "Content",
              description: "Add the body and excerpt.",
              status: "error",
            },
            { id: "review", label: "Review", status: "unavailable" },
          ]}
          validation={
            <ValidationSummary
              items={[{ href: "#body", message: "Add article body before continuing." }]}
            />
          }
          actions={
            <ButtonGroup ariaLabel="Stage actions">
              <Button type="submit" name="intent" value="back" variant="outline">
                Back
              </Button>
              <Button type="submit" name="intent" value="next">
                Continue
              </Button>
            </ButtonGroup>
          }
        >
          <Fieldset legend="Article content">
            <FormField id="body" label="Body" error="Add article body." />
          </Fieldset>
        </StagedForm>
      </HxForm>,
    );

    expect(html).toContain('<form action="/publish" id="publish-form" method="post"');
    expect(html).toContain('hx-post="/publish/stage"');
    expect(html).toContain('<section id="publish-stages" class="staged-form"');
    expect(html).toContain('aria-labelledby="publish-stages-heading"');
    expect(html).toContain(
      '<nav class="staged-form-progress" aria-label="Publish article progress">',
    );
    expect(html).toContain('class="staged-form-step staged-form-step--complete"');
    expect(html).toContain('<a href="/publish/basics"');
    expect(html).toContain(
      'class="staged-form-step staged-form-step--error staged-form-step--current"',
    );
    expect(html).toContain('aria-current="step"');
    expect(html).toContain("Current step, needs attention");
    expect(html).toContain('class="staged-form-step staged-form-step--unavailable"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain("Complete");
    expect(html).toContain("Unavailable");
    expect(html).toContain('id="publish-stages-panel" class="staged-form-panel"');
    expect(html).toContain('aria-describedby="publish-stages-content-description"');
    expect(html).toContain('class="validation-summary" role="alert"');
    expect(html).toContain('name="intent" value="back"');
    expect(html).toContain('name="intent" value="next"');
    expect(html).toContain('aria-invalid="true"');
  });

  test("passes HTMX attributes through step links and the staged shell", () => {
    const html = render(
      <StagedForm
        id="setup"
        currentStepId="details"
        hx-target="#setup"
        hx-swap="outerHTML"
        steps={[
          {
            id: "details",
            label: "Details",
            href: "/setup/details",
            "hx-get": "/setup/details",
            "hx-target": "#setup",
          },
          { id: "confirm", label: "Confirm", status: "error", href: "/setup/confirm" },
        ]}
      >
        Details
      </StagedForm>,
    );

    expect(html).toContain('hx-target="#setup"');
    expect(html).toContain('hx-swap="outerHTML"');
    expect(html).toContain('href="/setup/details" aria-current="step" hx-get="/setup/details"');
    expect(html).toContain('data-status="error"');
  });

  test("falls back to a generic progress label for non-text headings", () => {
    const html = render(
      <StagedForm
        heading={<span>Setup</span>}
        currentStepId="details"
        steps={[{ id: "details", label: "Details" }]}
      >
        Details
      </StagedForm>,
    );

    expect(html).toContain('aria-label="Form progress"');
    expect(html).not.toContain("[object Object]");
  });
});
