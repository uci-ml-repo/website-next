import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

export class UserRemoveService {
  async byId({ userId }: { userId: string }) {
    await db.delete(user).where(eq(user.id, userId));
  }
}
