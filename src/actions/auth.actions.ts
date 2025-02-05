"use server";

import bcryptjs from "bcryptjs";

import { signIn } from "@/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import service from "@/server/service";

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
    const existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
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

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
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
    const existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists. Try signing in.",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await db.insert(user).values({
      email,
      password: hashedPassword,
      name,
    });

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    service.email.sendRegistrationEmail({ email, name }).then();

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
