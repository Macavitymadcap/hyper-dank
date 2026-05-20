export interface ProgressProps {
  className?: string;
  label: string;
  max?: number;
  value?: number;
}

export const Progress = ({ className, label, max = 100, value }: ProgressProps) => {
  const classes = ["progress", className].filter(Boolean).join(" ");

  return (
    <label className={classes}>
      <span>{label}</span>
      <progress max={max} value={value} />
    </label>
  );
};
