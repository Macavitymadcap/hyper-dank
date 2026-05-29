export interface BadgeProps {
  children: unknown;
  className?: string;
  tone?: "accent" | "neutral" | "warning";
}

export const Badge = ({ children, className, tone = "neutral" }: BadgeProps) => {
  const classes = ["badge", className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-tone={tone}>
      {children}
    </span>
  );
};
