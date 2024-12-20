import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { HOME_PATH } from "@/lib/routes";

export const metadata: Metadata = { title: "Login" };

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session && session.user) {
    return redirect(HOME_PATH);
  }

  return <>{children}</>;
}
