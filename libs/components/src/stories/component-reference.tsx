export const componentReferenceSections = [
  "Purpose",
  "Inputs and slots",
  "Rendered output",
  "Accessibility",
  "App-owned behaviour",
  "CSS hooks",
] as const;

export type ComponentReferenceSection = (typeof componentReferenceSections)[number];

export interface ComponentReferenceProps {
  className?: string;
  id: string;
  sections: Record<ComponentReferenceSection, readonly string[]>;
  title?: string;
}

export const ComponentReference = ({
  className,
  id,
  sections,
  title = "Reference details",
}: ComponentReferenceProps) => {
  const classes = ["storybook-doc__section", "storybook-doc__reference", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section class={classes} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{title}</h2>
      <dl>
        {componentReferenceSections.map((section) => (
          <div class="storybook-doc__reference-row">
            <dt>{section}</dt>
            <dd>
              <ul>
                {sections[section].map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
