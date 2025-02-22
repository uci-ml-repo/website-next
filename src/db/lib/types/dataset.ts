import type { dataset } from "@/db/schema";

export type AcceptedDatasetRequiredFields =
  | "doi"
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "dataTypes"
  | "tasks"
  | "featureTypes";

export type DatasetSelect = typeof dataset.$inferSelect;
