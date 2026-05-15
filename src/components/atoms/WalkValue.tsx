import { styleRegistry } from "../style-registry";
 
interface WalkValueProps { value: string | number }
 
const walkValueStyles = /* css */`
.walk-value {
  text-align: center;
  padding: var(--size-2);
  color: var(--gray-0);
}
`;
 
export const WalkValue = ({ value }: WalkValueProps) => {
  styleRegistry.register(walkValueStyles);
 
  return (
    <td className="walk-value">{value}</td>
  )
}