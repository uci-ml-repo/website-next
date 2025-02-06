import z from "zod";

import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";
import { order } from "@/server/schema/lib/order";

export const datasetQuery = z.object({
  order: order([
    "viewCount",
    "donatedAt",
    "instanceCount",
    "featureCount",
    "title",
  ]).optional(),
  search: z.string().optional(),
  limit: z.number().int().optional(),
  cursor: z.number().int().optional(),
  keywords: z.array(z.string()).optional(),
  attributes: z
    .array(z.enum(enumToArray(Enums.DatasetCharacteristic)))
    .optional(),
  subjectAreas: z
    .array(z.enum(enumToArray(Enums.DatasetSubjectArea)))
    .optional(),
  tasks: z.array(z.enum(enumToArray(Enums.DatasetTask))).optional(),
  instanceCount: z.number().int().min(0).optional(),
  featureCount: z.number().int().min(0).optional(),
  featureType: z
    .array(z.enum(enumToArray(Enums.DatasetFeatureType)))
    .optional(),
  python: z
    .enum(["true", "false"])
    .transform((x) => x === "true")
    .optional(),
});

export type DatasetQuery = z.infer<typeof datasetQuery>;
