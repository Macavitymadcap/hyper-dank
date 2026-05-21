export interface ToolbarProps {
  ariaLabel: string;
  children: unknown;
  className?: string;
  id?: string;
}

export const Toolbar = ({ ariaLabel, children, className, id }: ToolbarProps) => {
  const classes = ["toolbar", className].filter(Boolean).join(" ");

  return (
    <div id={id} className={classes} role="toolbar" aria-label={ariaLabel}>
      {children}
    </div>
  );
};
