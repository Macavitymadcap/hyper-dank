#!/usr/bin/env bun
import { createAuthProvider } from "../src/auth";
import { createDatabaseProvider } from "../src/db";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Admin";

if (!email) {
  throw new Error("ADMIN_EMAIL is required.");
}

if (!password || password.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
}

const databaseProvider = createDatabaseProvider();

try {
  await databaseProvider.migrate();
  const authProvider = createAuthProvider({ databaseProvider });
  const existingUser = (await authProvider.listUsers()).find((user) => user.email === email);

  if (existingUser) {
    await authProvider.setUserRole(existingUser.id, "admin");
    await authProvider.setUserBanned(existingUser.id, false);
    console.info(`Admin role ensured for ${email}.`);
  } else {
    await authProvider.createUser({
      email,
      name,
      password,
      role: "admin",
    });
    console.info(`Admin account created for ${email}.`);
  }
} finally {
  await databaseProvider.close();
}
