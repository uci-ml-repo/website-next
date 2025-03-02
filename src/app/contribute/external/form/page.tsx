import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CONTRIBUTE_DONATION_ROUTE } from "@/lib/routes";

export default async function Page() {
  const session = await auth();

  if (!session?.user.emailVerified) {
    return redirect(CONTRIBUTE_DONATION_ROUTE);
  }

  return <h1>Page</h1>;
}
