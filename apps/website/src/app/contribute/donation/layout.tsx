import { auth } from "@packages/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Donate a dataset" };

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect(ROUTES.AUTH.SIGN_IN({ callback: ROUTES.CONTRIBUTE.DONATION_FORM }));
  return <div className="blur-background mx-auto w-full max-w-3xl space-y-6">{children}</div>;
}
