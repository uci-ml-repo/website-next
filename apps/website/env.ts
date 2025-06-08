import { env as dbEnv } from "@packages/db/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    BASE_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    AUTH_SECRET: z.string(),
    GOOGLE_EMAIL: z.string(),
    GOOGLE_REFRESH_TOKEN: z.string(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string(),
    SEMANTIC_SCHOLAR_API_KEY: z.string(),
    EZID_USERNAME: z.string(),
    EZID_PASSWORD: z.string(),
    EZID_SHOULDER: z.string(),
  },
  extends: [dbEnv],
  experimental__runtimeEnv: process.env,
});
