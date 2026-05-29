export interface PanelProps {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: unknown;
  className?: string;
  labelledBy?: string;
  width?: "default" | "narrow";
}

export const Panel = ({
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  labelledBy,
  width = "default",
}: PanelProps) => {
  const classes = ["panel", className].filter(Boolean).join(" ");
  const labelledById = ariaLabelledBy ?? labelledBy;

  return (
    <section
      className={classes}
      data-width={width}
      aria-label={ariaLabel}
      aria-labelledby={labelledById}
    >
      {children}
    </section>
  );
};
