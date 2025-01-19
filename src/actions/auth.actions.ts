"use server";

import bcryptjs from "bcryptjs";

import { signIn } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

type Provider = "google" | "github";

export async function providerLogin({
  provider,
  redirectTo,
}: {
  provider: Provider;
  redirectTo: string;
}) {
  await signIn(provider, { redirect: true, redirectTo: redirectTo });
}

export async function credentialsLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    if (!existingUser.password) {
      return {
        success: false,
        message: `${existingUser.email} is registered with a provider. Try signing in with Google or Github`,
      };
    }

    const isPasswordMatches = bcryptjs.compareSync(
      password,
      existingUser.password,
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function credentialsRegister({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists. Try signing in.",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    });

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
