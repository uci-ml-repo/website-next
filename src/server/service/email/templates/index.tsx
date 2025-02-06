import { render } from "@react-email/render";
import path from "path";

import { RESET_PASSWORD_ROUTE, VERIFY_EMAIL_ROUTE } from "@/lib/routes";
import Registration from "@/server/service/email/templates/registration/Registration";
import registration from "@/server/service/email/templates/registration/registration";
import resetPassword from "@/server/service/email/templates/reset-password/reset-password";
import resetPasswordProviders from "@/server/service/email/templates/reset-password/reset-password-providers";
import resetPasswordSuccess from "@/server/service/email/templates/reset-password/reset-password-success";
import ResetPassword from "@/server/service/email/templates/reset-password/ResetPassword";
import ResetPasswordProviders from "@/server/service/email/templates/reset-password/ResetPasswordProviders";
import ResetPasswordSuccess from "@/server/service/email/templates/reset-password/ResetPasswordSuccess";
import verificationEmail from "@/server/service/email/templates/verification-email/verification-email";
import VerificationEmail from "@/server/service/email/templates/verification-email/VerificationEmail";

export default class EmailTemplateService {
  async registration(name: string) {
    return {
      html: await render(<Registration name={name} />),
      text: registration({ name }),
    };
  }

  async resetPassword({ name, token }: { name: string; token: string }) {
    if (!process.env.ORIGIN) {
      throw new Error("ORIGIN is not set");
    }

    const resetLink = path.join(
      process.env.ORIGIN,
      RESET_PASSWORD_ROUTE,
      token,
    );

    return {
      html: await render(<ResetPassword name={name} resetLink={resetLink} />),
      text: resetPassword({ name, resetLink }),
    };
  }

  async resetPasswordProviders({
    name,
    providers,
  }: {
    name: string;
    providers: string[];
  }) {
    return {
      html: await render(
        <ResetPasswordProviders name={name} providers={providers} />,
      ),
      text: resetPasswordProviders({ name, providers }),
    };
  }

  async verificationEmail({ name, token }: { name: string; token: string }) {
    if (!process.env.ORIGIN) {
      throw new Error("ORIGIN is not set");
    }

    const verificationLink = path.join(
      process.env.ORIGIN,
      VERIFY_EMAIL_ROUTE,
      token,
    );
    return {
      html: await render(
        <VerificationEmail name={name} verificationLink={verificationLink} />,
      ),
      text: verificationEmail({ name, verificationLink }),
    };
  }

  async resetPasswordSuccess({ name }: { name: string }) {
    return {
      html: await render(<ResetPasswordSuccess name={name} />),
      text: resetPasswordSuccess({ name }),
    };
  }
}
