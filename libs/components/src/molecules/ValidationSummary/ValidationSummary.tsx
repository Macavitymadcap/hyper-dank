export interface ValidationSummaryItem {
  href?: string;
  message: string;
}

export interface ValidationSummaryProps {
  className?: string;
  heading?: string;
  id?: string;
  items: ValidationSummaryItem[];
}

export const ValidationSummary = ({
  className,
  heading = "There is a problem",
  id,
  items,
}: ValidationSummaryProps) => {
  if (items.length === 0) return null;

  const classes = ["validation-summary", className].filter(Boolean).join(" ");

  return (
    <div id={id} className={classes} role="alert" tabIndex={-1}>
      <h2>{heading}</h2>
      <ul>
        {items.map((item) => (
          <li>{item.href ? <a href={item.href}>{item.message}</a> : item.message}</li>
        ))}
      </ul>
    </div>
  );
};
