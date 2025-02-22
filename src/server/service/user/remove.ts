import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";
import { service } from "@/server/service";
import { ServiceError } from "@/server/service/errors";

export class UserRemoveService {
  async byId({ userId }: { userId: string }) {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!existingUser) {
      throw new ServiceError({
        origin: "User",
        message: "User not found",
      });
    }

    await db.delete(user).where(eq(user.id, userId));

    await service.email.sendAccountDeletionEmail(existingUser);
  }
}
