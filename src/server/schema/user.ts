import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";

export const userQuery = z.object({
  search: z.string().optional(),
  role: z.enum(enumToArray(Enums.UserRole)).optional(),
  cursor: z.number().int().min(0).optional(),
  limit: z.number().int().min(0).optional(),
});

export const userSearchQuery = userQuery.required({ search: true });

export type UserQuery = z.infer<typeof userQuery>;
export type UserSearchQuery = z.infer<typeof userSearchQuery>;
