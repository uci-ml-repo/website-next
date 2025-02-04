import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

export default class UserPasswordService {
  async update(userId: string, newPassword: string) {
    return db
      .update(user)
      .set({ password: newPassword })
      .where(eq(user.id, userId));
  }

  async sendResetEmail(email: string) {
    // send email
  }
}
