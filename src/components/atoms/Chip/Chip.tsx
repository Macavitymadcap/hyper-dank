interface ChipProps {
  children: unknown;
  className?: string;
}

export const Chip = ({ children, className }: ChipProps) => {
  const classes = ["chip", className].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
};
