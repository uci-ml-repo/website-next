import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { selectColumns } from "@/db/lib/utils";
import { user } from "@/db/schema";

export const userSelect = {
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  createdAt: user.createdAt,
  role: user.role,
};

export const userColumns = selectColumns(userSelect);

export const userSchema = createSelectSchema(user).pick(userColumns);

export type UserSelect = z.infer<typeof userSchema>;
