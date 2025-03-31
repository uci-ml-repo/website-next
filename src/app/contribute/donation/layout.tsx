import { auth, signIn } from "@/auth";
import { CONTRIBUTE_DONATION_ROUTE } from "@/lib/routes";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: CONTRIBUTE_DONATION_ROUTE });
  }

  return children;
}
