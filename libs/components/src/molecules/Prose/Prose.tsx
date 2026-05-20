export interface ProseProps {
  children: unknown;
  className?: string;
  id?: string;
}

export const Prose = ({ children, className, id }: ProseProps) => {
  const classes = ["prose", className].filter(Boolean).join(" ");

  return (
    <article id={id} className={classes}>
      {children}
    </article>
  );
};
