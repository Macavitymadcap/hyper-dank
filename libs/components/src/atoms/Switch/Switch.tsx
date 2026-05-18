import { type HtmxProps, htmxAttributes } from "../../model";

export interface SwitchProps extends HtmxProps {
  id: string;
  label: string;
  checked?: boolean;
  className?: string;
  dataThemeToggle?: boolean;
  disabled?: boolean;
  name?: string;
  offIcon?: string;
  onIcon?: string;
  required?: boolean;
  thumbColor?: string;
  trackColor?: string;
  checkedTrackColor?: string;
  value?: string;
  variant?: "default" | "compact";
}

export const Switch = ({
  id,
  label,
  checked = false,
  checkedTrackColor,
  className,
  dataThemeToggle = false,
  disabled = false,
  name,
  offIcon = "light_mode",
  onIcon = "dark_mode",
  required = false,
  thumbColor,
  trackColor,
  value,
  variant = "default",
  ...hxProps
}: SwitchProps) => {
  const classes = ["switch", className].filter(Boolean).join(" ");
  const customProperties = [
    thumbColor && `--switch-thumb-bg: ${thumbColor}`,
    trackColor && `--switch-track-bg: ${trackColor}`,
    checkedTrackColor && `--switch-track-checked-bg: ${checkedTrackColor}`,
  ]
    .filter(Boolean)
    .join("; ");

  return (
    <label
      className={classes}
      htmlFor={id}
      data-variant={variant}
      style={customProperties || undefined}
    >
      <span className="switch-label">{label}</span>
      <input
        id={id}
        className="switch-input"
        type="checkbox"
        role="switch"
        name={name}
        value={value}
        aria-label={label}
        aria-checked={String(checked)}
        checked={checked}
        disabled={disabled}
        required={required}
        data-theme-toggle={dataThemeToggle ? "" : undefined}
        {...htmxAttributes(hxProps)}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="material-symbols-outlined switch-icon switch-icon-light">{offIcon}</span>
        <span className="material-symbols-outlined switch-icon switch-icon-dark">{onIcon}</span>
        <span className="switch-thumb"></span>
      </span>
    </label>
  );
};
