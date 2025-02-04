import Image from "next/image";

import { auth, signIn, signOut } from "@/auth";
import Main from "@/components/layout/Main";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/lib/routes";

export default async function Forbidden() {
  const session = await auth();

  return (
    <Main className="flex flex-col items-center justify-center space-y-4">
      <Image src="/img/anteater.png" alt="Anteater" width={200} height={200} />
      <h1 className="flex flex-col items-center space-y-4">
        <div className="text-7xl text-muted-foreground">403</div>
        <div className="text-4xl font-bold">Forbidden</div>
      </h1>
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
    </Main>
  );
}
