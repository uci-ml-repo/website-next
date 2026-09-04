import { db } from "@packages/db";
import { user } from "@packages/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import type { UpdateUserRole } from "@/server/types/user/request";

async function role({ userId, role }: UpdateUserRole) {
  const target = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { id: true, emailVerified: true },
  });

  if (!target) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  if (!target.emailVerified) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot edit the role of a user with an unverified email",
    });
  }

  const [updated] = await db.update(user).set({ role }).where(eq(user.id, userId)).returning({
    id: user.id,
    role: user.role,
  });

  return updated;
}

export const userUpdateService = { role };
