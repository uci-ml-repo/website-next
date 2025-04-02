import { cache } from "react";

import { caller } from "@/server/trpc/query/server";

export const getDataset = cache(async (id: number) => {
  try {
    if (!id) {
      return null;
    }

    return await caller.dataset.find.byId({ datasetId: id });
  } catch {
    return null;
  }
});
