import { ErrorPage } from "@components/layout/error-page";
import { auth } from "@website/lib/auth/auth";
import { authClient } from "@website/lib/auth/auth-client";
import { ROUTES } from "@website/lib/routes";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Forbidden() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <ErrorPage code={403} header="Forbidden">
      <div className="flex flex-col items-center space-y-2 text-lg">
        {session?.user ? (
          <button
            onClick={async () => {
              await authClient.signOut();
            }}
            className="text-link hover:underline"
          >
            Sign in with another account
          </button>
        ) : (
          <Link href={ROUTES.AUTH.SIGN_IN} className="text-link hover:underline">
            Sign in
          </Link>
        )}
        <div className="text-lg">
          <span>Go back </span>
          <Link href={ROUTES.HOME} className="text hover:underline">
            Home
          </Link>
        </div>
      </div>
    </ErrorPage>
  );
}
