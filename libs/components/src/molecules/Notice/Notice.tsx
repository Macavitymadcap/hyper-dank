export interface NoticeProps {
  children: unknown;
  className?: string;
  heading?: unknown;
  id?: string;
  tone?: "info" | "success" | "warning" | "danger";
}

export const Notice = ({ children, className, heading, id, tone = "info" }: NoticeProps) => {
  const classes = ["notice", className].filter(Boolean).join(" ");
  const role = tone === "danger" || tone === "warning" ? "alert" : "status";

  return (
    <section id={id} className={classes} data-tone={tone} role={role}>
      {heading ? <h2>{heading}</h2> : undefined}
      <div className="notice-body">{children}</div>
    </section>
  );
};
