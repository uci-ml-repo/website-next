import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "./src";

export async function handler() {
  await migrate(db, { migrationsFolder: "./migrations" });
}
