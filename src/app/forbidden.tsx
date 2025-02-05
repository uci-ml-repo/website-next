import { auth, signIn, signOut } from "@/auth";
import ErrorGraphic from "@/components/layout/ErrorGraphic";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/lib/routes";

export default async function Forbidden() {
  const session = await auth();

  return (
    <ErrorGraphic code={403} header="Forbidden">
      <div className="flex flex-col items-center space-y-2 text-lg">
        {session?.user ? (
          <button
            onClick={async () => {
              "use server";
              await signOut({
                redirectTo: SIGN_IN_ROUTE,
              });
            }}
            className="text-link hover:underline"
          >
            Sign in with another account
          </button>
        ) : (
          <button
            onClick={async () => {
              "use server";
              await signIn();
            }}
            className="text-link hover:underline"
          >
            Sign in
          </button>
        )}
        <div className="text-lg">
          <span>Go back </span>
          <a href={HOME_ROUTE} className="text-link hover:underline">
            Home
          </a>
        </div>
      </div>
    </ErrorGraphic>
  );
}
