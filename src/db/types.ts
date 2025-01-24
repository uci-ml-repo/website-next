import { z } from "zod";

import type { RequireNonNullable } from "@/lib/utils";

import type { author, dataset, paper } from "./schema";

export type AcceptedDatasetRequiredFields =
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "characteristics"
  | "tasks"
  | "featureTypes";

export const acceptedDataset = z.object({
  yearCreated: z.number(),
  instanceCount: z.number(),
  description: z.string(),
  subjectArea: z.string(),
  characteristics: z.array(z.string()),
  tasks: z.array(z.string()),
  featureTypes: z.array(z.string()),
});

export type DatasetsSelect = typeof dataset.$inferSelect;
export type AcceptedDatasetSelect = RequireNonNullable<
  DatasetsSelect,
  AcceptedDatasetRequiredFields
>;

export type AuthorsSelect = typeof author.$inferSelect;

export type PapersSelect = typeof paper.$inferSelect;
