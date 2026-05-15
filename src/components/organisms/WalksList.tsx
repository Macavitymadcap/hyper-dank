import type { WalkWithStats } from "../../db";
import { WalkItem } from "../molecules/WalkItem";
import { styleRegistry } from "../style-registry";

const walkListStyles = /* css */`
.empty-state {
  text-align: center;
  padding: var(--size-10) var(--size-4);
  color: var(--gray-6);
  font-size: var(--font-size-2);
}

.table-container {
  max-height: clamp(16rem, calc(100vh - 360px), 34rem);
  overflow: auto;
  background: var(--gray-9);
  border-radius: var(--radius-2);
  scrollbar-gutter: stable;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  position: sticky;
  top: 0;
  z-index: var(--layer-2);
  padding: var(--size-2);
  background: var(--gray-9);
  text-align: center;
  color: var(--gray-0);
  font-weight: var(--font-weight-7);
  font-size: var(--font-size-1);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
  box-shadow: 0 var(--border-size-1) 0 var(--gray-7);
}

tr {
  border-bottom: var(--border-size-1) solid var(--gray-7);
}

td {
  border-bottom: var(--border-size-1) solid var(--gray-7);
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr {
  background: var(--gray-8);
}

tbody tr:hover {
  background: var(--gray-7);
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
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Mi</th>
            <th>Min</th>
            <th>Sec</th>
            <th>mph</th>
            <th>min/mi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
};
