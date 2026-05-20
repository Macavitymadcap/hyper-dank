export interface StatBlockProps {
  className?: string;
  label: unknown;
  meta?: unknown;
  trend?: unknown;
  value: unknown;
}

export const StatBlock = ({ className, label, meta, trend, value }: StatBlockProps) => {
  const classes = ["stat-block", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <dt>{label}</dt>
      <dd>
        <strong>{value}</strong>
        {meta ? <span className="stat-block-meta">{meta}</span> : undefined}
        {trend ? <span className="stat-block-trend">{trend}</span> : undefined}
      </dd>
    </div>
  );
};
