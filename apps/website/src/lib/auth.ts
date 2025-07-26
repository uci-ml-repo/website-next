import { env } from "@env";
import { db } from "@packages/db";
import { Enums, enumToArray } from "@packages/db/enum";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { v7 as uuidv7 } from "uuid";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: enumToArray(Enums.UserRole),
        defaultValue: Enums.UserRole.BASIC,
        input: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
  },
});

export type Session = typeof auth.$Infer.Session;
