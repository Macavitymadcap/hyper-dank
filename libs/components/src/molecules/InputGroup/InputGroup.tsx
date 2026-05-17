export interface InputGroupProps {
  type: string;
  name: string;
  label: string;
  min: number;
  max?: number;
  step?: number;
  placeholder: string;
  value?: number | string;
}

export const InputGroup = ({
  type,
  name,
  label,
  min,
  max,
  step,
  placeholder,
  value,
}: InputGroupProps) => {
  return (
    <div className="input-group">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        step={step}
        min={min}
        max={max}
        required
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};
