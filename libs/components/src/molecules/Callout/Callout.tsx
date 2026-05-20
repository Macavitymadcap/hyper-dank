export interface CalloutProps {
  children: unknown;
  className?: string;
  title?: unknown;
  tone?: "info" | "success" | "warning" | "danger";
}

export const Callout = ({ children, className, title, tone = "info" }: CalloutProps) => {
  const classes = ["callout", className].filter(Boolean).join(" ");
  const role = tone === "danger" || tone === "warning" ? "alert" : "note";

  return (
    <aside className={classes} data-tone={tone} role={role}>
      {title ? <strong>{title}</strong> : undefined}
      <div className="callout-body">{children}</div>
    </aside>
  );
};
