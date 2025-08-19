import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { author } from "../schema";

export const authorSelectSchema = createSelectSchema(author);
export type AuthorSelect = z.infer<typeof authorSelectSchema>;
