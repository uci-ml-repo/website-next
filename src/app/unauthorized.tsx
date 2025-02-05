import { signIn } from "@/auth";
import ErrorGraphic from "@/components/layout/ErrorGraphic";
import { HOME_ROUTE } from "@/lib/routes";

export default function Unauthorized() {
  return (
    <ErrorGraphic code={401} header="Unauthorized">
      <div className="flex flex-col items-center space-y-2 text-lg">
        <button
          onClick={async () => {
            "use server";
            await signIn();
          }}
          className="text-link hover:underline"
        >
          Sign in
        </button>
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
