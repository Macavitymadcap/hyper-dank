export interface CompactListItem {
  controls?: unknown;
  label: string;
  meta?: string;
  value: string;
}

export interface CompactListProps {
  className?: string;
  items: CompactListItem[];
}

export const CompactList = ({ className, items }: CompactListProps) => {
  const classes = ["compact-list", className].filter(Boolean).join(" ");

  return (
    <dl className={classes}>
      {items.map((item) => (
        <div className="compact-list-row">
          <dt>{item.label}</dt>
          <dd>
            <strong>{item.value}</strong>
            {item.meta ? <span>{item.meta}</span> : null}
            {item.controls ? <span className="compact-list-controls">{item.controls}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
};
