export interface SegmentedControlOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  className?: string;
  legend: string;
  name: string;
  options: SegmentedControlOption[];
  value?: string;
}

export const SegmentedControl = ({
  className,
  legend,
  name,
  options,
  value,
}: SegmentedControlProps) => {
  const classes = ["segmented-control", className].filter(Boolean).join(" ");

  return (
    <fieldset className={classes}>
      <legend>{legend}</legend>
      <div className="segmented-control-options">
        {options.map((option) => {
          const id = `${name}-${option.value}`;

          return (
            <label htmlFor={id} data-selected={option.value === value ? "true" : undefined}>
              <input
                id={id}
                name={name}
                type="radio"
                checked={option.value === value}
                disabled={option.disabled}
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
