import { eq } from "drizzle-orm";

import { db } from "@/db";
import type { Enums } from "@/db/lib/enums";
import { user } from "@/db/schema";

export class UserUpdateService {
  async role({ userId, role }: { userId: string; role: Enums.UserRole }) {
    return db.update(user).set({ role }).where(eq(user.id, userId));
  }
}
