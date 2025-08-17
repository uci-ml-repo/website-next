import { db } from "@packages/db";
import { Enums, enumToArray } from "@packages/db/enum";
import { sendEmail } from "@packages/email";
import { resetPassword, verifyEmail } from "@packages/email/emails";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { Resource } from "sst";
import { v7 as uuid } from "uuid";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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
      clientId: Resource.GITHUB_CLIENT_ID.value,
      clientSecret: Resource.GOOGLE_CLIENT_SECRET.value,
    },
    google: {
      clientId: Resource.GOOGLE_CLIENT_ID.value,
      clientSecret: Resource.GOOGLE_CLIENT_SECRET.value,
    },
  },
  account: {
    accountLinking: { enabled: true },
  },
  user: {
    additionalFields: {
      role: {
        type: enumToArray(Enums.UserRole),
        input: false,
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      storeOTP: "hashed",
      async sendVerificationOTP({ email, otp }) {
        await sendEmail({
          to: email,
          subject: "Verify email - UCI Machine Learning Repository",
          html: await verifyEmail({ otp }),
          text: await verifyEmail({ otp }, { plainText: true }),
        });
      },
    }),
  ],
  telemetry: { enabled: false },
});

export type Session = typeof auth.$Infer.Session;
