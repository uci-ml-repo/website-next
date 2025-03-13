import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcryptjs from "bcryptjs";
import NextAuth, { type DefaultSession, type User } from "next-auth";
import { encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuid } from "uuid";

import authConfig from "@/auth.config";
import { db } from "@/db";
import type { UserRole } from "@/db/lib/enums";
import { account, session, user } from "@/db/schema";
import { env } from "@/env";
import { SIGN_IN_ROUTE } from "@/lib/routes";
import { service } from "@/server/service";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      emailVerified: Date | null;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole;
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: user,
  accountsTable: account,
  sessionsTable: session,
});

export const authOptions = NextAuth({
  adapter,
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: {},
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        });

        if (!user || !user.password) {
          return null;
        }

        if (bcryptjs.compareSync(password, user.password)) {
          return user as User;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, user }) {
      session.user.role = user.role;
      session.user.emailVerified = user.emailVerified;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const existingUser = await service.user.find.byId(user.id ?? "");

      if (!existingUser) {
        return;
      }

      // if the user was just created
      if (Date.now() - existingUser.createdAt.getTime() < 1000) {
        service.email
          .sendRegistrationEmail(user as { email: string; name: string })
          .then();
      }
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return encode(params);
    },
  },
  pages: {
    signIn: SIGN_IN_ROUTE,
  },
  secret: env.AUTH_SECRET,
});

export const { handlers, auth, signIn, signOut } = authOptions;
