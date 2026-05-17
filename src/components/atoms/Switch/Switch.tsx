export interface SwitchProps {
  id: string;
  label: string;
  checked?: boolean;
  dataThemeToggle?: boolean;
}

export const Switch = ({ id, label, checked = false, dataThemeToggle = false }: SwitchProps) => (
  <label className="switch" htmlFor={id}>
    <span className="switch-label">{label}</span>
    <input
      id={id}
      className="switch-input"
      type="checkbox"
      role="switch"
      aria-label={label}
      aria-checked={String(checked)}
      checked={checked}
      data-theme-toggle={dataThemeToggle ? "" : undefined}
    />
    <span className="switch-track" aria-hidden="true">
      <span className="material-symbols-outlined switch-icon switch-icon-light">light_mode</span>
      <span className="material-symbols-outlined switch-icon switch-icon-dark">dark_mode</span>
      <span className="switch-thumb"></span>
    </span>
  </label>
);
