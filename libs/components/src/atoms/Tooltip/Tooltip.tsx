export interface TooltipProps {
  children: unknown;
  className?: string;
  content: unknown;
  id: string;
  side?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({ children, className, content, id, side = "top" }: TooltipProps) => {
  const classes = ["tooltip", className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-side={side}>
      <button className="tooltip-trigger" type="button" aria-describedby={id}>
        {children}
      </button>
      <span className="tooltip-content" id={id} role="tooltip">
        {content}
      </span>
    </span>
  );
};
