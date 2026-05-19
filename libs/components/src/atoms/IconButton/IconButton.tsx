import { Button, type ButtonProps } from "../Button";
import { Icon } from "../Icon";

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: string;
  label: string;
}

export const IconButton = ({ className, icon, label, ...buttonProps }: IconButtonProps) => {
  const classes = ["icon-button", className].filter(Boolean).join(" ");

  return (
    <Button {...buttonProps} ariaLabel={label} className={classes}>
      <Icon name={icon} />
    </Button>
  );
};
