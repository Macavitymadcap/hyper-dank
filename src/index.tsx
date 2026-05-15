import { Hono } from 'hono';
import { db } from './db';
import { Home, StatsSection, WalksList } from './components';

const app = new Hono();

// Home page
app.get('/', (c) => {
  const walks = db.getAllWalks();
  const stats = db.getStats();
  
  return c.html(<Home walks={walks} stats={stats} />);
});

// Get updated stats (HTMX)
app.get('/stats', (c) => {
  const stats = db.getStats();
  return c.html(<StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />);
});

// Add new walk (HTMX)
app.post('/walks', async (c) => {
  const body = await c.req.parseBody();
  const miles = Number.parseFloat(body.miles as string);
  const minutes = Number.parseInt(body.minutes as string);
  const seconds = Number.parseInt(body.seconds as string);
  
  if (Number.isNaN(miles) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return c.text('Invalid input', 400);
  }
  
  db.addWalk(miles, minutes, seconds);
  const walks = db.getAllWalks();
  
  return c.html(<WalksList walks={walks} />);
});

// Delete walk (HTMX)
app.delete('/walks/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  db.deleteWalk(id);
  
  const walks = db.getAllWalks();
  return c.html(<WalksList walks={walks} />);
});

const port = 3000;
console.log(`🚶 Walking Pace Tracker running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};