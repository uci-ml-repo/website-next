import { TRPCError } from "@trpc/server";
import { forbidden, notFound, permanentRedirect, unauthorized } from "next/navigation";

import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  if (isNaN(id)) return notFound();

  try {
    const dataset = await trpc.dataset.find.byId({ id });
    return permanentRedirect(ROUTES.DATASET(dataset));
  } catch (error) {
    if (error instanceof TRPCError) {
      switch (error.code) {
        case "NOT_FOUND":
          return notFound();
        case "UNAUTHORIZED":
          return unauthorized();
        case "FORBIDDEN":
          return forbidden();
      }
    }

    throw error;
  }
}
