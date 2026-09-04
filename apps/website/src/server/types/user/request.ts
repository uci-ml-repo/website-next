import { Enums } from "@packages/db/enum";
import { z } from "zod";

export const userOrder = z.enum(["newest", "oldest", "role"]);
export type UserOrder = z.infer<typeof userOrder>;

export const userQuery = z.object({
  limit: z.number().int().min(1).max(100).optional().default(10),
  cursor: z.number().int().optional(),
  search: z.string().optional(),
  roles: z.enum(Enums.UserRole).array().optional(),
  order: userOrder.optional(),
});

export type UserQueryInput = z.input<typeof userQuery>;
export type UserQuery = z.infer<typeof userQuery>;

export const updateUserRole = z.object({
  userId: z.uuid(),
  role: z.enum(Enums.UserRole),
});

export type UpdateUserRole = z.infer<typeof updateUserRole>;
