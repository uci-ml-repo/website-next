import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { emailVerificationToken, passwordResetToken, user } from "@/db/schema";
import { formatEnum, generateToken } from "@/lib/utils";
import { service } from "@/server/service";
import { ServiceError } from "@/server/service/errors";

export class UserCredentialsService {
  async sendResetPasswordEmail({ email }: { email: string }) {
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

      const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

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

  async sendVerificationEmail({
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

    await db.insert(emailVerificationToken).values({
      userId,
      token,
      expires,
    });

    await service.email.sendVerificationEmail({
      token,
      email,
      name,
    });
  }

  async getEmailVerificationToken(token: string) {
    const emailVerificationToken =
      await db.query.emailVerificationToken.findFirst({
        where: (emailVerificationToken, { eq }) =>
          eq(emailVerificationToken.token, token),
        with: {
          user: true,
        },
      });

    if (!emailVerificationToken) {
      return {
        success: false,
        message: "Invalid verification token",
      };
    }

    if (emailVerificationToken.expires < new Date()) {
      return {
        success: false,
        message: "Verification token expired",
      };
    }

    return { success: true, verificationToken: emailVerificationToken };
  }

  async getResetPasswordToken(token: string) {
    const passwordResetToken = await db.query.passwordResetToken.findFirst({
      where: (passwordResetToken, { eq }) =>
        eq(passwordResetToken.token, token),
      with: {
        user: true,
      },
    });

    if (!passwordResetToken) {
      return {
        success: false,
        message: "Invalid reset token",
      };
    }

    if (passwordResetToken.expires < new Date()) {
      return {
        success: false,
        message: "Reset token expired",
      };
    }

    return { success: true, resetToken: passwordResetToken };
  }

  async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) {
    const { success, message, resetToken } =
      await this.getResetPasswordToken(token);

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

    await db
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, resetToken.userId));

    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    await service.email.sendResetPasswordSuccessEmail({
      email: resetToken.user.email,
      name: resetToken.user.name,
    });

    return { success: true };
  }

  async verifyEmail({ token }: { token: string }) {
    const { success, message, verificationToken } =
      await this.getEmailVerificationToken(token);

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

    await db
      .delete(emailVerificationToken)
      .where(eq(emailVerificationToken.token, token));

    return verificationToken.user;
  }
}
