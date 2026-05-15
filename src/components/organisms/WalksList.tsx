import type { WalkWithStats } from "../../db";
import { WalkItem } from "../molecules/WalkItem";
import { styleRegistry } from "../templates/style-registry";

const walkListStyles = /* css */`
.empty-state {
  text-align: center;
  padding: var(--size-10) var(--size-4);
  color: var(--gray-6);
  font-size: var(--font-size-2);
}

table {
  width: 100%;
}
`;

export const WalksList = ({ walks }: { walks: WalkWithStats[] }) => {
  styleRegistry.register(walkListStyles);

  if (walks.length === 0) {
    return (
      <div class="empty-state">
        No walks recorded yet. Add your first walk above!
      </div>
    );
  }
  
  return (
    <table>
      <tr>
        <th>Mi</th>
        <th>Min</th>
        <th>Sec</th>
        <th>mph</th>
        <th>min/mi</th>
        <th></th>
      </tr>
      {walks.map(walk => (
        <WalkItem 
          key={walk.id} 
          id={walk.id} 
          miles={walk.miles} 
          minutes={walk.minutes} 
          seconds={walk.seconds} 
          speed={walk.speed} 
          pace={walk.pace} 
        />
      ))}
    </table>
  );
};