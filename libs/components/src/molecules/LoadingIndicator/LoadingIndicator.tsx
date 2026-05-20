export interface LoadingIndicatorProps {
  className?: string;
  label?: string;
}

export const LoadingIndicator = ({ className, label = "Loading" }: LoadingIndicatorProps) => {
  const classes = ["loading-indicator", className].filter(Boolean).join(" ");

  return (
    <span className={classes} role="status" aria-live="polite">
      <span aria-hidden="true" className="loading-indicator-mark" />
      <span>{label}</span>
    </span>
  );
};
