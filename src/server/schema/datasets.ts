import z from "zod";

export const datasetQuery = z.object({
  orderBy: z.enum(["viewCount", "donatedAt"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
});

export type DatasetQuery = z.infer<typeof datasetQuery>;
