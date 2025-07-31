import { env } from "@env";
import { sendEmail } from "@lib/mail";
import { db } from "@packages/db";
import { Enums, enumToArray } from "@packages/db/enum";
import { resetPassword, verifyEmail } from "@packages/email";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { v7 as uuid } from "uuid";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    database: {
      generateId: () => uuid(),
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: (password) => bcrypt.hash(password, 10),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
    sendResetPassword: async ({ user, url }) => {
      const { email, name } = user;

      await sendEmail({
        to: email,
        subject: "Reset password - UCI Machine Learning Repository",
        html: await resetPassword({ name, url }),
        text: await resetPassword({ name, url }, { plainText: true }),
      });
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
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
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { email, name } = user;

      await sendEmail({
        to: email,
        subject: "Verify email - UCI Machine Learning Repository",
        html: await verifyEmail({ name, url }),
        text: await verifyEmail({ name, url }, { plainText: true }),
      });
    },
  },
});

export type Session = typeof auth.$Infer.Session;
