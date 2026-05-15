import type { WalkWithStats } from "../../db";
import { WalksRow } from "../molecules/WalksRow";

export const WalksTable = ({ walks }: { walks: WalkWithStats[] }) => {
  if (walks.length === 0) {
    return (
      <div class="empty-state">
        No walks recorded yet. Add your first walk above!
      </div>
    );
  }
  
  return (
    <div class="table-container">
      <table class="walks-table">
        <thead>
          <tr class="walks-row">
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
            <WalksRow 
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
