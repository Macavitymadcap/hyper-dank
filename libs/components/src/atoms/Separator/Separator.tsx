export interface SeparatorProps {
  className?: string;
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const Separator = ({
  className,
  decorative = true,
  orientation = "horizontal",
}: SeparatorProps) => {
  const classes = ["separator", className].filter(Boolean).join(" ");

  return (
    <hr
      className={classes}
      data-orientation={orientation}
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
    />
  );
};
