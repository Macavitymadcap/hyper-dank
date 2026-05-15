import { Hono } from 'hono';
import type { WalkRepository } from './db';
import { Repository } from './db';
import { Home, StatsSection, WalksList } from './components';
import { validateWalkInput } from './walks/validation';

export interface AppDependencies {
  walksRepository?: WalkRepository;
}

export const createApp = ({ walksRepository = new Repository() }: AppDependencies = {}) => {
  const app = new Hono();

  app.get('/', (context) => {
    const walks = walksRepository.getAllWalks();
    const stats = walksRepository.getStats();
    
    return context.html(<Home walks={walks} stats={stats} />);
  });

  app.get('/stats', (context) => {
    const stats = walksRepository.getStats();
    return context.html(<StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />);
  });

  app.post('/walks', async (context) => {
    const body = await context.req.parseBody();
    const validation = validateWalkInput(body);

    if (!validation.ok) {
      return context.text(validation.message, 400);
    }
    
    walksRepository.addWalk(validation.value);
    const walks = walksRepository.getAllWalks();
    
    return context.html(<WalksList walks={walks} />);
  });

  app.delete('/walks/:id', (context) => {
    const id = Number(context.req.param('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return context.text('Walk id must be a positive integer.', 400);
    }

    walksRepository.deleteWalk(id);
    const walks = walksRepository.getAllWalks();

    return context.html(<WalksList walks={walks} />);
  });

  return app;
};
