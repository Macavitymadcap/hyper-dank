import { createApp } from "./app";
import { createDatabaseProvider } from "./db";

const port = Number(process.env.PORT ?? 3000);
const databaseProvider = createDatabaseProvider();
await databaseProvider.migrate();

const walksRepository = databaseProvider.createWalkRepository();
const app = createApp({ walksRepository });

console.log(`🚶 Walking Pace Tracker running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
