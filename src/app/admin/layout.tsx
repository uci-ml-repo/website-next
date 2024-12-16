import { UserRole } from "@prisma/client";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) {
    return unauthorized();
  }

  if (session.user.role !== UserRole.ADMIN) {
    return unauthorized();
  }

  return <>{children}</>;
}
