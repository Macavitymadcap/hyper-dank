export interface MetadataListItem {
  label: unknown;
  value: unknown;
}

export interface MetadataListProps {
  className?: string;
  items: MetadataListItem[];
}

export const MetadataList = ({ className, items }: MetadataListProps) => {
  const classes = ["metadata-list", className].filter(Boolean).join(" ");

  return (
    <dl className={classes}>
      {items.map((item) => (
        <div className="metadata-list-row">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
