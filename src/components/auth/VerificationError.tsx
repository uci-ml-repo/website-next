import { ErrorGraphic } from "@/components/layout/ErrorGraphic";
import { PROFILE_SETTINGS_ROUTE } from "@/lib/routes";

export function VerificationError() {
  return (
    <ErrorGraphic header="Verification Required">
      <div className="text-lg">
        <span>To continue, </span>
        <a href={PROFILE_SETTINGS_ROUTE} className="text-link hover:underline">
          verify your email address
        </a>
      </div>
    </ErrorGraphic>
  );
}
