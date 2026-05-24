export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface StatusSymbolProps {
  className?: string;
  decorative?: boolean;
  label?: string;
  status?: StatusTone;
}

const statusMetadata: Record<StatusTone, { shape: string; symbol: string }> = {
  danger: { shape: "octagon", symbol: "!" },
  info: { shape: "circle", symbol: "i" },
  neutral: { shape: "dot", symbol: "•" },
  success: { shape: "check", symbol: "✓" },
  warning: { shape: "triangle", symbol: "!" },
};

export const StatusSymbol = ({
  className,
  decorative = false,
  label,
  status = "neutral",
}: StatusSymbolProps) => {
  const classes = ["status-symbol", className].filter(Boolean).join(" ");
  const metadata = statusMetadata[status];

  if (decorative) {
    return (
      <span aria-hidden="true" className={classes} data-shape={metadata.shape} data-status={status}>
        {metadata.symbol}
      </span>
    );
  }

  return (
    <span
      aria-label={label ?? status}
      className={classes}
      data-shape={metadata.shape}
      data-status={status}
      role="img"
    >
      {metadata.symbol}
    </span>
  );
};
