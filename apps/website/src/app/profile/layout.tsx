import { auth } from "@packages/auth/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileNav } from "@/components/profile/profile-nav";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN());
  }

  return (
    <div className="blur-background space-y-6">
      <div className="space-y-10">
        <ProfileHeader session={session} />
        <ProfileNav />
      </div>
      {children}
    </div>
  );
}
