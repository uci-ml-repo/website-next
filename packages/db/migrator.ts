import * as fs from "node:fs";

import { count, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "./src";
import { dataset } from "./src/schema";

export async function handler() {
  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  const [datasets] = await db.select({ count: count() }).from(dataset);

  if (fs.existsSync("./seed.sql") && datasets.count === 0) {
    const sqlContent = fs.readFileSync("./seed.sql", "utf-8");
    await db.execute(sql.raw(sqlContent));
  }
}
