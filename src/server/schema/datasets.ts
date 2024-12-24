import type { Prisma } from "@prisma/client";
import z from "zod";

const orderByEnum: [
  Prisma.DatasetScalarFieldEnum,
  ...Prisma.DatasetScalarFieldEnum[],
] = ["viewCount", "donatedAt"];

export const datasetQuery = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(orderByEnum).optional(),
  skip: z.number().int().nonnegative().optional(),
  take: z.number().int().nonnegative().optional(),
  cursor: z.number().int().optional(),
});

export type DatasetQuery = z.infer<typeof datasetQuery>;
