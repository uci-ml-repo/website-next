import { ErrorPage } from "@website/components/layout/error-page";
import { ROUTES } from "@website/lib/routes";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <ErrorPage code={401} header="Unauthorized">
      <div className="flex flex-col items-center space-y-2 text-lg">
        <Link href={ROUTES.AUTH.SIGN_IN} className="text-link hover:underline">
          Sign in
        </Link>
        <div className="text-lg">
          <span>Go back </span>
          <Link href={ROUTES.HOME} className="text-link hover:underline">
            Home
          </Link>
        </div>
      </div>
    </ErrorPage>
  );
}
