import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../atoms/Button";
import { ButtonGroup } from "../../molecules/ButtonGroup";
import { CodeBlock } from "../../molecules/CodeBlock";
import { Fieldset } from "../../molecules/Fieldset";
import { FormField } from "../../molecules/FormField";
import { HxForm } from "../../molecules/HxForm";
import { ValidationSummary } from "../../molecules/ValidationSummary";
import { renderStory } from "../../stories/render";
import { StagedForm } from ".";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Reusable app-region organism for staged workflows. The consuming app provides current step state, validation, actions, routes, permissions, and persistence; StagedForm renders the accessible region and HTMX-friendly composition boundary.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Organisms/StagedForm",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const WorkflowRegion: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="organism-staged-form-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Shared organism</p>
          <h1 id="organism-staged-form-heading" class="storybook-doc__title">
            StagedForm organism
          </h1>
          <p class="storybook-doc__lede">
            Use the organism subpath for app-level workflow regions that render shared structure
            from route-owned state without taking over domain decisions.
          </p>
        </header>
        <div class="storybook-doc__grid storybook-doc__grid--two">
          <section class="storybook-doc__section" aria-labelledby="organism-staged-form-preview">
            <h2 id="organism-staged-form-preview">Rendered output</h2>
            <HxForm
              action="/articles/new"
              method="post"
              hx-post="/articles/new/stage"
              hx-target="#organism-article-stages"
              hx-swap="outerHTML"
            >
              <StagedForm
                id="organism-article-stages"
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
                    "hx-target": "#organism-article-stages",
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
                    items={[
                      { href: "#organism-article-body", message: "Add body copy before review." },
                    ]}
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
                  <FormField
                    id="organism-article-body"
                    label="Body"
                    name="body"
                    error="Add body copy."
                  />
                </Fieldset>
              </StagedForm>
            </HxForm>
          </section>
          <section class="storybook-doc__section" aria-labelledby="organism-staged-form-boundary">
            <h2 id="organism-staged-form-boundary">Organism boundary</h2>
            <ul>
              <li>Owns: reusable region markup, step navigation, panel slots, and ARIA state.</li>
              <li>Receives: current step, validation, actions, links, and HTMX attributes.</li>
              <li>Leaves to apps: schemas, branching rules, saves, permissions, and redirects.</li>
              <li>Importing from the organism subpath is additive; root imports still work.</li>
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
    await expect(canvas.getByRole("heading", { name: "StagedForm organism" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("navigation", { name: "Article setup stages" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
  },
};
