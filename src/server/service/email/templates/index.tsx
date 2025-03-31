import { render } from "@react-email/render";
import path from "path";

import { env } from "@/env";
import { RESET_PASSWORD_ROUTE, VERIFY_EMAIL_ROUTE } from "@/lib/routes";
import {
  AccountDeletion,
  accountDeletion,
} from "@/server/service/email/templates/account-deletion/AccountDeletion";
import {
  Registration,
  registration,
} from "@/server/service/email/templates/registration/Registration";
import {
  ResetPassword,
  resetPassword,
} from "@/server/service/email/templates/reset-password/ResetPassword";
import {
  ResetPasswordProviders,
  resetPasswordProviders,
} from "@/server/service/email/templates/reset-password/ResetPasswordProviders";
import {
  ResetPasswordSuccess,
  resetPasswordSuccess,
} from "@/server/service/email/templates/reset-password/ResetPasswordSuccess";
import {
  VerificationEmail,
  verificationEmail,
} from "@/server/service/email/templates/verification-email/VerificationEmail";

export class EmailTemplateService {
  async registration(name: string) {
    return {
      html: await render(<Registration name={name} />),
      text: registration({ name }),
    };
  }

  async resetPassword({ name, token }: { name: string; token: string }) {
    const resetLink = path.join(env.ORIGIN, RESET_PASSWORD_ROUTE, token);

    return {
      html: await render(<ResetPassword name={name} resetLink={resetLink} />),
      text: resetPassword({ name, resetLink }),
    };
  }

  async resetPasswordProviders({ name, providers }: { name: string; providers: string[] }) {
    return {
      html: await render(<ResetPasswordProviders name={name} providers={providers} />),
      text: resetPasswordProviders({ name, providers }),
    };
  }

  async verificationEmail({ name, token }: { name: string; token: string }) {
    if (!env.ORIGIN) {
      throw new Error("ORIGIN is not set");
    }

    const verificationLink = path.join(env.ORIGIN, VERIFY_EMAIL_ROUTE, token);

    return {
      html: await render(<VerificationEmail name={name} verificationLink={verificationLink} />),
      text: verificationEmail({ name, verificationLink }),
    };
  }

  async resetPasswordSuccess({ name }: { name: string }) {
    return {
      html: await render(<ResetPasswordSuccess name={name} />),
      text: resetPasswordSuccess({ name }),
    };
  }

  async accountDeletion({ name }: { name: string }) {
    return {
      html: await render(<AccountDeletion name={name} />),
      text: accountDeletion({ name }),
    };
  }
}
