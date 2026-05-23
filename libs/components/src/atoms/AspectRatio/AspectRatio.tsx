export interface AspectRatioProps {
  children: unknown;
  className?: string;
  ratio?: string;
}

export const AspectRatio = ({ children, className, ratio = "16 / 9" }: AspectRatioProps) => {
  const classes = ["aspect-ratio", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={`--aspect-ratio: ${ratio};`}>
      {children}
    </div>
  );
};
