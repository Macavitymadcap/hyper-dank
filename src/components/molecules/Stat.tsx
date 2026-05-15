import { styleRegistry } from "../templates/style-registry";

interface StatProps { label: string; value?: number }

export const statStyle = /* css */`
.stat {
  background: var(--gray-2);
  padding: var(--size-3);
  border-radius: var(--radius-2);
  text-align: center;
}

.stat-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  color: var(--gray-7);
  margin-bottom: var(--size-1);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
}

.stat-value {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  color: var(--gray-9);
}
`;

export const Stat = ({ label, value }: StatProps) => {
  styleRegistry.register(statStyle);
  
  const formattedValue = value && value > 0 ? value.toFixed(1) : '--';
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{formattedValue}</div>
    </div>
  )
}