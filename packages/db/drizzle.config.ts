import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    host: Resource.Database.host,
    port: Number(Resource.Database.port),
    user: Resource.Database.username,
    password: Resource.Database.password,
    database: Resource.Database.database,
    ssl: process.env.SST_STAGE === "production",
  },
});
