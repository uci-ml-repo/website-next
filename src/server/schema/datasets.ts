import z from "zod";

export const datasetQuery = z.object({});

export type DatasetQuery = z.infer<typeof datasetQuery>;
