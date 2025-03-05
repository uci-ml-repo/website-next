import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";
import { z } from "zod";

import {
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
  DATASET_FILES_ZIP_PATH,
  DATASET_FILES_ZIP_PENDING_PATH,
} from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { fileAccessProcedure } from "@/server/trpc";
import type { createContext } from "@/server/trpc/context";
import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";

function datasetEditablePaths(dataset: DatasetResponse) {
  return [
    DATASET_FILES_ZIP_PATH(dataset),
    DATASET_FILES_ZIP_PENDING_PATH(dataset),
    DATASET_FILES_UNZIPPED_PATH(dataset),
    DATASET_FILES_UNZIPPED_PENDING_PATH(dataset),
  ];
}

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const datasetFilesUpdateProcedure = t.procedure
  .input(z.object({ datasetId: z.number() }))
  .unstable_concat(fileAccessProcedure)
  .unstable_concat(datasetUpdateProcedure)
  .use(({ ctx, input, next }) => {
    if (
      !input.path ||
      !datasetEditablePaths(ctx.dataset).includes(input.path)
    ) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Dataset id ${input.datasetId} does not have ${input.path}`,
      });
    }

    return next();
  });
