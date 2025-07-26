import { ErrorPage } from "@components/layout/error-page";
import { ROUTES } from "@lib/routes";
import Link from "next/link";

export default function NotFound() {
  return (
    <ErrorPage code={404} header="Page not found">
      <Link href={ROUTES.HOME} className="text-link text-lg hover:underline">
        Return Home
      </Link>
    </ErrorPage>
  );
}
