import type { PgColumn } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { user } from "@/db/schema";

export const userSelect: Partial<
  Record<keyof typeof user.$inferSelect, PgColumn>
> = {
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  createdAt: user.createdAt,
  role: user.role,
};

export const userSelectColumns: Record<keyof UserSelect, true> = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  role: true,
};

export const userSelectSchema = createSelectSchema(user).omit({
  password: true,
});

export type UserSelect = z.infer<typeof userSelectSchema>;
