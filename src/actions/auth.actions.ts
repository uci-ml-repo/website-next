"use server";

import bcryptjs from "bcryptjs";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    if (!existingUser.password) {
      return {
        success: false,
        message:
          "User is registered with a provider. Try signing in with Google or Github",
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
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
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
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
