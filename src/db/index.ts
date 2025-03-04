import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  // logger: true,
  schema,
});
