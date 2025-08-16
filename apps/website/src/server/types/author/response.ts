import { author } from "@packages/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const authorSelectSchema = createSelectSchema(author);

export type AuthorSelect = z.infer<typeof authorSelectSchema>;
