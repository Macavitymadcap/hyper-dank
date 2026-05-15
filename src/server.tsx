import { type Context, Hono } from 'hono';
import { Repository } from './db';
import { Home, StatsSection, WalksList } from './components';

export class Server {
  app: Hono;
  db: Repository;

  constructor() {
    this.app = new Hono();
    this.db = new Repository()

    this.app.get('/', (context) => this.getHomePage(context));
    this.app.get('/stats', (context) => this.getStats(context));
    this.app.post('/walks', async (context) => this.postWalks(context));
    this.app.delete('/walks/:id', (context) => this.deleteWalk(context));
  }

  getHomePage(context: Context) {
    const walks = this.db.getAllWalks();
    const stats = this.db.getStats();
    
    return context.html(<Home walks={walks} stats={stats} />);
  }

  getStats(context: Context) {
    const stats = this.db.getStats();
    return context.html(<StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />);
  }

  async postWalks(context: Context) {
    const body = await context.req.parseBody();
    const miles = Number.parseFloat(body.miles as string);
    const minutes = Number.parseInt(body.minutes as string);
    const seconds = Number.parseInt(body.seconds as string);
    
    if (Number.isNaN(miles) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
      return context.text('Invalid input', 400);
    }
    
    this.db.addWalk(miles, minutes, seconds);
    const walks = this.db.getAllWalks();
    
    return context.html(<WalksList walks={walks} />);
  }

  async deleteWalk(context: Context) {
    const id = Number.parseInt(context.req.param('id') as string);
    this.db.deleteWalk(id);
    
    const walks = this.db.getAllWalks();
    return context.html(<WalksList walks={walks} />);
  }
}
