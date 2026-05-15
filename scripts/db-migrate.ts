#!/usr/bin/env bun
import { createDatabaseProvider } from "../src/db";

const databaseProvider = createDatabaseProvider();

try {
  await databaseProvider.migrate();
  console.log("Database migrations complete.");
} finally {
  await databaseProvider.close();
}
