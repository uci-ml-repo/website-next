import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginRegister } from "@/components/auth/LoginRegister";
import { Main } from "@/components/layout/Main";
import { HOME_ROUTE } from "@/lib/routes";

export const metadata: Metadata = { title: "Login" };

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    return redirect(HOME_ROUTE);
  }

  return (
    <Main>
      <LoginRegister />
    </Main>
  );
}
