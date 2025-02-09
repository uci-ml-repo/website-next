import { ErrorGraphic } from "@/components/layout/ErrorGraphic";
import { HOME_ROUTE } from "@/lib/routes";

export default function NotFound() {
  return (
    <ErrorGraphic code={404} header="Page not found">
      <div className="text-lg">
        <span>Go back </span>
        <a href={HOME_ROUTE} className="text-link hover:underline">
          Home
        </a>
      </div>
    </ErrorGraphic>
  );
}
