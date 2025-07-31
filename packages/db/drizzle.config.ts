import "dotenv/config";

import { defineConfig } from "drizzle-kit";

import { env } from "./env";

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
