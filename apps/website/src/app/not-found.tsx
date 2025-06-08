import { ErrorPage } from "@website/components/layout/error-page";
import { ROUTES } from "@website/lib/routes";
import Link from "next/link";

export default function NotFound() {
  return (
    <ErrorPage code={404} header="Page not found">
      <div className="text-lg">
        <span>Return </span>
        <Link href={ROUTES.HOME} className="text-link hover:underline">
          Home
        </Link>
      </div>
    </ErrorPage>
  );
}
