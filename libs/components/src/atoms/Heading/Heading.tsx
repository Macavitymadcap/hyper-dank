export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  children: unknown;
  className?: string;
  id?: string;
  level?: HeadingLevel;
  visualLevel?: HeadingLevel;
}

export const Heading = ({ children, className, id, level = 2, visualLevel }: HeadingProps) => {
  const classes = ["heading", className].filter(Boolean).join(" ");
  const HeadingElement = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <HeadingElement className={classes} data-level={visualLevel ?? level} id={id}>
      {children}
    </HeadingElement>
  );
};
