import type { Prisma } from "@prisma/client";
import z from "zod";

const orderByEnum = ["viewCount", "donatedAt"] satisfies [
  Prisma.DatasetScalarFieldEnum,
  ...Prisma.DatasetScalarFieldEnum[],
];

export const datasetQuery = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(orderByEnum).optional(),
  skip: z.number().int().nonnegative().optional(),
  take: z.number().int().nonnegative().optional(),
  cursor: z.number().int().optional(),
});

export type DatasetQuery = z.infer<typeof datasetQuery>;
