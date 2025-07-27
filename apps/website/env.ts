import { env as dbEnv } from "@packages/db/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    //------------------------------------------------------------------------------
    // Auth config
    //------------------------------------------------------------------------------
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    AUTH_SECRET: z.string(),

    // ------------------------------------------------------------------------------
    // Google credentials
    // ------------------------------------------------------------------------------
    GOOGLE_EMAIL: z.string(),
    GOOGLE_REFRESH_TOKEN: z.string(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string(),

    // ------------------------------------------------------------------------------
    // EZID credentials for DOI registration
    // ------------------------------------------------------------------------------
    EZID_USERNAME: z.string(),
    EZID_PASSWORD: z.string(),
    EZID_SHOULDER: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },

  extends: [dbEnv],
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
