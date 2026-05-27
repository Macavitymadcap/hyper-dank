export interface VisuallyHiddenProps {
  children: unknown;
  className?: string;
  id?: string;
}

export const VisuallyHidden = ({ children, className, id }: VisuallyHiddenProps) => {
  const classes = ["visually-hidden", className].filter(Boolean).join(" ");

  return (
    <span className={classes} id={id}>
      {children}
    </span>
  );
};
