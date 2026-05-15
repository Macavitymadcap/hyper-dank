import { createApp } from "./app";
import { Repository } from "./db";

const port = Number(process.env.PORT ?? 3000);
const dbPath = process.env.DB_PATH ?? "walking-pace-db";
const walksRepository = new Repository({ filename: dbPath });
const app = createApp({ walksRepository });

console.log(`🚶 Walking Pace Tracker running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
