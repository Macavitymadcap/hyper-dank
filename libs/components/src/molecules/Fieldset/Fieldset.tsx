export interface FieldsetProps {
  children: unknown;
  className?: string;
  description?: string;
  legend: string;
}

export const Fieldset = ({ children, className, description, legend }: FieldsetProps) => {
  const classes = ["fieldset", className].filter(Boolean).join(" ");

  return (
    <fieldset className={classes}>
      <legend>{legend}</legend>
      {description ? <p className="fieldset-description">{description}</p> : undefined}
      {children}
    </fieldset>
  );
};
