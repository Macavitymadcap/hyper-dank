export interface TimelineListItem {
  body?: unknown;
  label: unknown;
  meta?: unknown;
  time?: string;
}

export interface TimelineListProps {
  className?: string;
  items: TimelineListItem[];
}

export const TimelineList = ({ className, items }: TimelineListProps) => {
  const classes = ["timeline-list", className].filter(Boolean).join(" ");

  return (
    <ol className={classes}>
      {items.map((item) => (
        <li className="timeline-list-item">
          <div>
            {item.time ? (
              <time datetime={item.time}>{item.meta ?? item.time}</time>
            ) : item.meta ? (
              <span>{item.meta}</span>
            ) : undefined}
            <strong>{item.label}</strong>
          </div>
          {item.body ? <div className="timeline-list-body">{item.body}</div> : undefined}
        </li>
      ))}
    </ol>
  );
};
