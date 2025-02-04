import { redirect } from "next/navigation";

import { DATASETS_ROUTE } from "@/lib/routes";

export default function Page() {
  return redirect(DATASETS_ROUTE);
}
