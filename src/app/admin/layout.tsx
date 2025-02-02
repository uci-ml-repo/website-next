import { forbidden } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Enums } from "@/db/enums";
import { ADMIN_ROUTE } from "@/lib/routes";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: ADMIN_ROUTE });
  }

  if (session.user.role !== Enums.UserRole.ADMIN) {
    return forbidden();
  }

  return <>{children}</>;
}
