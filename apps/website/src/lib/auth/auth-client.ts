import { env } from "@website/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.BASE_URL,
});
