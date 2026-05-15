import { Hono } from "hono";
import { Home, StatsSection, WalksTable } from "./components";
import type { WalkRepository } from "./db";
import { validateWalkInput } from "./walks/validation";

export interface AppDependencies {
  walksRepository: WalkRepository;
}

export const createApp = ({ walksRepository }: AppDependencies) => {
  const app = new Hono();

  app.get("/", async (context) => {
    const walks = await walksRepository.getAllWalks();
    const stats = await walksRepository.getStats();

    return context.html(<Home walks={walks} stats={stats} />);
  });

  app.get("/stats", async (context) => {
    const stats = await walksRepository.getStats();
    return context.html(<StatsSection avgSpeed={stats.avgSpeed} medianPace={stats.medianPace} />);
  });

  app.post("/walks", async (context) => {
    const body = await context.req.parseBody();
    const validation = validateWalkInput(body);

    if (!validation.ok) {
      return context.text(validation.message, 400);
    }

    await walksRepository.addWalk(validation.value);
    const walks = await walksRepository.getAllWalks();

    return context.html(<WalksTable walks={walks} />);
  });

  app.delete("/walks", async (context) => {
    await walksRepository.clearWalks();
    return context.html(<WalksTable walks={[]} />);
  });

  app.delete("/walks/:id", async (context) => {
    const id = Number(context.req.param("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return context.text("Walk id must be a positive integer.", 400);
    }

    await walksRepository.deleteWalk(id);
    const walks = await walksRepository.getAllWalks();

    return context.html(<WalksTable walks={walks} />);
  });

  return app;
};
