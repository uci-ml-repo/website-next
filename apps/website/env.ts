import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
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

  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
