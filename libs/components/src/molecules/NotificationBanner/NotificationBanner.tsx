import { StatusSymbol, type StatusTone } from "../StatusSymbol";

export type NotificationSeverity = Exclude<StatusTone, "neutral">;

export interface NotificationBannerProps {
  children: unknown;
  className?: string;
  id?: string;
  severity?: NotificationSeverity;
  title?: unknown;
}

const severityLabel: Record<NotificationSeverity, string> = {
  danger: "Danger",
  info: "Information",
  success: "Success",
  warning: "Warning",
};

const severityShape: Record<NotificationSeverity, string> = {
  danger: "octagon",
  info: "circle",
  success: "check",
  warning: "triangle",
};

export const NotificationBanner = ({
  children,
  className,
  id,
  severity = "info",
  title,
}: NotificationBannerProps) => {
  const classes = ["notification-banner", className].filter(Boolean).join(" ");
  const isUrgent = severity === "danger" || severity === "warning";

  return (
    <section
      aria-label={severityLabel[severity]}
      aria-live={isUrgent ? "assertive" : "polite"}
      className={classes}
      data-severity={severity}
      data-shape={severityShape[severity]}
      id={id}
      role={isUrgent ? "alert" : "status"}
    >
      <StatusSymbol decorative status={severity} />
      <div className="notification-banner-content">
        {title ? (
          <h2>{title}</h2>
        ) : (
          <span className="notification-banner-label">{severityLabel[severity]}</span>
        )}
        <div className="notification-banner-body">{children}</div>
      </div>
    </section>
  );
};
