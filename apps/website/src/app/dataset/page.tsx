import { permanentRedirect } from "next/navigation";

import { ROUTES } from "@/lib/routes";

export default function Page() {
  return permanentRedirect(ROUTES.SEARCH());
}
