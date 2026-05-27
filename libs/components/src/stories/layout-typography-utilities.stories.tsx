import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Card } from "../atoms/Card";
import { Container } from "../atoms/Container";
import { Grid } from "../atoms/Grid";
import { Heading } from "../atoms/Heading";
import { Link } from "../atoms/Link";
import { Stack } from "../atoms/Stack";
import { Text } from "../atoms/Text";
import { VisuallyHidden } from "../atoms/VisuallyHidden";
import { CodeBlock } from "../molecules/CodeBlock";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Small layout and typography helpers for width, spacing, simple grids, readable text, links, and accessible hidden labels. Product page layout and brand typography stay in consuming apps.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Layout And Typography Utilities",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const UtilityComposition: Story = {
  render: () =>
    renderStory(
      <Container as="main" width="wide" labelledBy="utility-heading">
        <Stack gap="1.25rem">
          <header>
            <Text as="span" tone="muted" size="sm" weight="medium">
              Utility primitives
            </Text>
            <Heading id="utility-heading" level={1} visualLevel={2}>
              Layout and typography
            </Heading>
            <Text tone="muted">
              Use these helpers for repeated composition glue before creating a product-specific
              layout component.
            </Text>
            <Grid as="div" gap="0.45rem" minColumnWidth="7rem">
              <Badge>Container</Badge>
              <Badge>Stack</Badge>
              <Badge>Grid</Badge>
              <Badge>Heading</Badge>
              <Badge>Text</Badge>
              <Badge>Link</Badge>
              <Badge>VisuallyHidden</Badge>
            </Grid>
          </header>
          <Grid minColumnWidth="14rem">
            <Card as="section" className="storybook-doc__section">
              <Stack gap="0.75rem">
                <Heading level={2} visualLevel={4}>
                  Width
                </Heading>
                <Text>Container keeps readable max-widths without owning the page shell.</Text>
                <Stack as="div" align="start" gap="0.45rem">
                  <Badge>Container</Badge>
                </Stack>
              </Stack>
            </Card>
            <Card as="section" className="storybook-doc__section">
              <Stack gap="0.75rem">
                <Heading level={2} visualLevel={4}>
                  Rhythm
                </Heading>
                <Text>
                  Stack and Grid keep local spacing predictable with CSS custom properties.
                </Text>
                <Stack as="div" align="start" gap="0.45rem">
                  <Badge tone="accent">Stack</Badge>
                  <Badge tone="accent">Grid</Badge>
                </Stack>
              </Stack>
            </Card>
            <Card as="section" className="storybook-doc__section">
              <Stack gap="0.75rem">
                <Heading level={2} visualLevel={4}>
                  Copy
                </Heading>
                <Text>
                  Heading, Text, and Link keep semantic HTML visible while brand voice stays
                  app-owned.
                </Text>
                <Stack as="div" align="start" gap="0.45rem">
                  <Badge>Heading</Badge>
                  <Badge>Text</Badge>
                  <Badge>Link</Badge>
                  <Badge>VisuallyHidden</Badge>
                </Stack>
                <Link href="/libraries/ui" current>
                  Link reference <VisuallyHidden>current page via VisuallyHidden</VisuallyHidden>
                </Link>
              </Stack>
            </Card>
          </Grid>
          <CodeBlock
            language="tsx"
            code={`import {
  Container,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
  VisuallyHidden,
} from "@macavitymadcap/hyper-dank-ui";

export function UtilityLayout() {
  return (
    <Container as="main" labelledBy="page-title" width="wide">
      <Stack gap="1.25rem">
        <Heading id="page-title" level={1}>Release desk</Heading>
        <Text tone="muted">Product copy and route data stay app-owned.</Text>
        <Grid minColumnWidth="14rem">
          <section>First panel</section>
          <section>Second panel</section>
        </Grid>
        <Link href="/libraries/ui" current>
          UI reference <VisuallyHidden>current page</VisuallyHidden>
        </Link>
      </Stack>
    </Container>
  );
}`}
          />
        </Stack>
      </Container>,
      { size: "wide" },
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "Layout and typography" }),
    ).toBeInTheDocument();
    await expect(canvas.getAllByText("Container").length).toBeGreaterThan(0);
    await expect(canvas.getAllByText("VisuallyHidden").length).toBeGreaterThan(0);
    await expect(canvas.getByRole("link", { name: /Link reference/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
