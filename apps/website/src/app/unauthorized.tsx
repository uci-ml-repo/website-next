import Link from "next/link";

import { ErrorPage } from "@/components/layout/error-page";
import { ROUTES } from "@/lib/routes";

export default function Unauthorized() {
  return (
    <ErrorPage code={401} header="Unauthorized">
      <div className="flex flex-col items-center space-y-2 text-lg">
        <Link href={ROUTES.AUTH.SIGN_IN()} className="text-link hover:underline">
          Sign in
        </Link>
        <Link href={ROUTES.HOME} className="text-link hover:underline">
          Return Home
        </Link>
      </div>
    </ErrorPage>
  );
}
