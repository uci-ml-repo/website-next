import "dotenv/config";

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  runtimeEnv: process.env,
});
