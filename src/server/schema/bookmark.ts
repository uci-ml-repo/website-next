import z from "zod";

export const bookmarkQuery = z.object({
  search: z.string().optional(),
  limit: z.number().optional(),
  cursor: z.number().optional(),
});

export type BookmarkQuery = z.infer<typeof bookmarkQuery>;
