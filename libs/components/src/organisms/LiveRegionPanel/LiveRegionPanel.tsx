import { type HtmxProps, htmxAttributes } from "../../model";

export interface LiveRegionPanelProps extends HtmxProps {
  busy?: boolean;
  children?: unknown;
  className?: string;
  empty?: unknown;
  id: string;
  loading?: unknown;
  status?: unknown;
  title?: unknown;
  "sse-connect"?: string;
  "sse-swap"?: string;
}

export const LiveRegionPanel = ({
  busy = false,
  children,
  className,
  empty,
  id,
  loading,
  status,
  title,
  "sse-connect": sseConnect,
  "sse-swap": sseSwap,
  ...hxProps
}: LiveRegionPanelProps) => {
  const classes = ["live-region-panel", className].filter(Boolean).join(" ");
  const headingId = title ? `${id}-heading` : undefined;
  const body = busy && loading ? loading : children || empty;

  return (
    <section
      id={id}
      className={classes}
      aria-busy={busy ? "true" : undefined}
      aria-labelledby={headingId}
      aria-live="polite"
      role="status"
      sse-connect={sseConnect}
      sse-swap={sseSwap}
      {...htmxAttributes(hxProps)}
    >
      {title ? (
        <header className="live-region-panel-header">
          <h2 id={headingId}>{title}</h2>
          {status ? <p className="live-region-panel-status">{status}</p> : undefined}
        </header>
      ) : status ? (
        <p className="live-region-panel-status">{status}</p>
      ) : undefined}
      <div className="live-region-panel-body">{body}</div>
    </section>
  );
};
