export interface TooltipProps {
  className?: string;
  content: unknown;
  id: string;
  label: string;
  side?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({ className, content, id, label, side = "top" }: TooltipProps) => {
  const classes = ["tooltip", className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-side={side}>
      <button className="tooltip-trigger" type="button" aria-describedby={id}>
        {label}
      </button>
      <span className="tooltip-content" id={id} role="tooltip">
        {content}
      </span>
    </span>
  );
};
