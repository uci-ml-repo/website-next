import { forbidden, unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { Enums } from "@/db/lib/enums";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  if (session.user.role !== Enums.UserRole.ADMIN) {
    return forbidden();
  }

  return children;
}
