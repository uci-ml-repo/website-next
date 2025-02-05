import * as crypto from "node:crypto";

import { db } from "@/db";
import { passwordResetToken } from "@/db/schema";
import { formatEnum } from "@/lib/utils";
import service from "@/server/service";

export default class UserCredentialsService {
  async passwordReset({ email }: { email: string }) {
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (!user) {
      return;
    }

    if (!user.password) {
      const accounts = await service.user.find.accounts(user.id);

      await service.email.sendResetPasswordProvidersEmail({
        email: user.email,
        name: user.name,
        providers: accounts.map((account) => formatEnum(account.provider)),
      });
    } else {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await db.insert(passwordResetToken).values({
        userId: user.id,
        token,
        expires,
      });

      await service.email.sendResetPasswordEmail({
        token,
        email: user.email,
        name: user.name,
      });
    }
  }
}
