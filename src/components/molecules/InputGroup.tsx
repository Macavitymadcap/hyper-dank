import { styleRegistry } from "../style-registry";

interface InputGroupProps {
  type: string;
  name: string;
  label: string;
  min: number;
  max?: number;
  step?: number;
  placeholder: string;
}

const inputGroupStyles = /* css */`
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.input-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
}

input[type="number"] {
  padding: var(--size-2);
  border: var(--border-size-2) solid var(--gray-3);
  border-radius: var(--radius-2);
  font-size: var(--font-size-2);
  text-align: center;
  width: 100%;
  background: var(--gray-0);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--blue-6);
  box-shadow: var(--shadow-2);
}
`;

export const InputGroup = ({ 
  type, 
  name,
  label, 
  min, 
  max, 
  step, 
  placeholder 
} : InputGroupProps) => {
  styleRegistry.register(inputGroupStyles);

  return (
    <div className="input-group">
      <label className="input-label" htmlFor={name}>{label}</label>
      <input 
        type={type} 
        id={name} 
        name={name}
        step={step} 
        min={min}
        max={max}
        required 
        placeholder={placeholder}
      />
    </div>
  )
}