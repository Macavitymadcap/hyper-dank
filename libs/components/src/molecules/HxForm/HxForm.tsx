import { type HtmxProps, htmxAttributes } from "../../model";

/** Progressive form wrapper that keeps native form submission and HTMX enhancement together. */
export interface HxFormProps extends HtmxProps {
  /** Native fallback URL used when JavaScript or HTMX is unavailable. */
  action: string;
  /** Labelled controls, outputs, and submit actions owned by the consuming app. */
  children: unknown;
  className?: string;
  id?: string;
  /** Native form method. Pair with the equivalent HTMX verb when enhancing the same route. */
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
