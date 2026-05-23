export interface SkeletonProps {
  className?: string;
  height?: string;
  label?: string;
  shape?: "line" | "block" | "circle";
  width?: string;
}

export const Skeleton = ({ className, height, label, shape = "line", width }: SkeletonProps) => {
  const classes = ["skeleton", className].filter(Boolean).join(" ");
  const customProperties = [
    width && `--skeleton-width: ${width}`,
    height && `--skeleton-height: ${height}`,
  ]
    .filter(Boolean)
    .join("; ");

  if (label) {
    return (
      <span
        className={classes}
        data-shape={shape}
        role="status"
        style={customProperties || undefined}
      >
        <span className="skeleton-label">{label}</span>
      </span>
    );
  }

  return (
    <span
      className={classes}
      data-shape={shape}
      aria-hidden="true"
      style={customProperties || undefined}
    />
  );
};
