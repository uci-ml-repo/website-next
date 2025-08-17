import { auth } from "@packages/auth/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Login or Register",
  description: "Login or register for a UCI Machine Learning Repository account.",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(ROUTES.HOME);
  }

  return children;
}
