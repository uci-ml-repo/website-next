import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { Enums } from "@/db/enums";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) {
    return unauthorized();
  }

  if (session.user.role !== Enums.UserRole.ADMIN) {
    return unauthorized();
  }

  return <>{children}</>;
}
