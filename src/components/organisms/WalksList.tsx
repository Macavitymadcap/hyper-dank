import type { WalkWithStats } from "../../db";
import { WalkItem } from "../molecules/WalkItem";

export const WalksList = ({ walks }: { walks: WalkWithStats[] }) => {
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
