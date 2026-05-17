import { type HtmxProps, htmxAttributes } from "../../model";

export interface HxFormProps extends HtmxProps {
  action: string;
  children: unknown;
  className?: string;
  id?: string;
  method: "get" | "post";
}

export const HxForm = ({ action, children, className, id, method, ...hxProps }: HxFormProps) => {
  return (
    <form
      action={action}
      className={className}
      id={id}
      method={method}
      {...htmxAttributes(hxProps)}
    >
      {children}
    </form>
  );
};
