import { ErrorPage } from "@components/layout/error-page";
import { auth } from "@lib/auth";
import { ROUTES } from "@lib/routes";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Forbidden() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <ErrorPage code={403} header="Forbidden">
      <div className="flex flex-col items-center space-y-2 text-lg">
        {session?.user ? (
          <button>Try signing in with another account</button>
        ) : (
          <Link href={ROUTES.AUTH.SIGN_IN} className="text-link hover:underline">
            Sign in
          </Link>
        )}
        <Link href={ROUTES.HOME} className="text-link hover:underline">
          Return Home
        </Link>
      </div>
    </ErrorPage>
  );
}
