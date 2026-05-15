import { Server } from "./server";

const server = new Server();

const port = 3000;
console.log(`🚶 Walking Pace Tracker running at http://localhost:${port}`);

export default {
  port,
  fetch: server.app.fetch,
};