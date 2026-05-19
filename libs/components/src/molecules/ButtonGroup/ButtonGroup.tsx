export interface ButtonGroupProps {
  ariaLabel: string;
  children: unknown;
  className?: string;
  id?: string;
}

export const ButtonGroup = ({ ariaLabel, children, className, id }: ButtonGroupProps) => {
  const classes = ["button-group", className].filter(Boolean).join(" ");

  return (
    <fieldset id={id} className={classes}>
      <legend>{ariaLabel}</legend>
      {children}
    </fieldset>
  );
};
