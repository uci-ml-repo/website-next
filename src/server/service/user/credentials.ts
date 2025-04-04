import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { emailVerificationToken, passwordResetToken, user } from "@/db/schema";
import { formatEnum, generateToken } from "@/lib/utils";
import { service } from "@/server/service";
import { ServiceError } from "@/server/service/errors";

export namespace userCredentialsService {
  export async function sendResetPasswordEmail({ email }: { email: string }) {
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
      const token = generateToken();
      const hashedToken = await bcryptjs.hash(token, 10);
      const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      const [createdToken] = await db
        .insert(passwordResetToken)
        .values({
          userId: user.id,
          token: hashedToken,
          expires,
        })
        .returning();

      const tokenString = `${createdToken.id}:${token}`;

      await service.email.sendResetPasswordEmail({
        token: tokenString,
        email: user.email,
        name: user.name,
      });
    }
  }

  export async function sendVerificationEmail({
    userId,
    email,
    name,
  }: {
    userId: string;
    email: string;
    name: string;
  }) {
    const verifyUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    if (!verifyUser) {
      throw new ServiceError({
        origin: "User",
        message: "User not found",
      });
    }

    if (verifyUser.emailVerified) {
      throw new ServiceError({
        origin: "User",
        message: "Email already verified",
      });
    }

    const token = generateToken();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const [createdVerificationToken] = await db
      .insert(emailVerificationToken)
      .values({
        userId,
        token,
        expires,
      })
      .returning();

    const tokenString = `${createdVerificationToken.id}:${token}`;

    await service.email.sendVerificationEmail({
      token: tokenString,
      email,
      name,
    });
  }

  export async function getEmailVerificationToken(tokenString: string) {
    const [id, token] = tokenString.split(":");

    if (!id || !token) {
      return { success: false, message: "Invalid verification token" };
    }

    const existingVerificationToken = await db.query.emailVerificationToken.findFirst({
      where: eq(emailVerificationToken.id, id),
      with: { user: true },
    });

    if (!existingVerificationToken) {
      return { success: false, message: "Invalid verification token" };
    }

    if (existingVerificationToken.expires < new Date()) {
      return { success: false, message: "Verification token expired" };
    }

    return { success: true, verificationToken: existingVerificationToken };
  }

  export async function getResetPasswordToken(tokenString: string) {
    const [id, token] = tokenString.split(":");

    if (!id || !token) {
      return { success: false, message: "Invalid reset token" };
    }

    const existingPasswordResetToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.id, id),
      with: { user: true },
    });

    if (
      !existingPasswordResetToken ||
      !bcryptjs.compareSync(token, existingPasswordResetToken.token)
    ) {
      return { success: false, message: "Invalid reset token" };
    }

    if (existingPasswordResetToken.expires < new Date()) {
      return { success: false, message: "Reset token expired" };
    }

    return { success: true, resetToken: existingPasswordResetToken };
  }

  export async function resetPassword({ token, password }: { token: string; password: string }) {
    const { success, message, resetToken } = await getResetPasswordToken(token);

    if (!success || !resetToken?.user.password) {
      throw new ServiceError({
        origin: "User",
        message: message,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    if (bcryptjs.compareSync(password, resetToken.user.password)) {
      throw new ServiceError({
        origin: "User",
        message: "New password must be different from your old password",
      });
    }

    await db.update(user).set({ password: hashedPassword }).where(eq(user.id, resetToken.userId));

    await db.delete(passwordResetToken).where(eq(passwordResetToken.token, token));

    await service.email.sendResetPasswordSuccessEmail({
      email: resetToken.user.email,
      name: resetToken.user.name,
    });

    return { success: true };
  }

  export async function verifyEmail({ token }: { token: string }) {
    const { success, message, verificationToken } = await getEmailVerificationToken(token);

    if (!success || !verificationToken) {
      throw new ServiceError({
        origin: "User",
        message: message,
      });
    }

    if (verificationToken.user.emailVerified) {
      throw new ServiceError({
        origin: "User",
        message: "Email already verified",
      });
    }

    await db
      .update(user)
      .set({ emailVerified: new Date() })
      .where(eq(user.id, verificationToken.user.id));

    await db.delete(emailVerificationToken).where(eq(emailVerificationToken.token, token));

    return verificationToken.user;
  }
}
