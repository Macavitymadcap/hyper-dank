export interface LabelledOutputProps {
  className?: string;
  label: string;
  meta?: unknown;
  value?: number | string;
}

export const LabelledOutput = ({ className, label, meta, value }: LabelledOutputProps) => {
  const classes = ["labelled-output", className].filter(Boolean).join(" ");
  const formattedValue =
    typeof value === "number" ? (value > 0 ? value.toFixed(1) : "--") : (value ?? "--");

  return (
    <div className={classes}>
      <output className="labelled-output-label">{label}</output>
      <output className="labelled-output-value">{formattedValue}</output>
      {meta ? <span className="labelled-output-meta">{meta}</span> : undefined}
    </div>
  );
};
