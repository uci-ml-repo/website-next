import { render } from "@react-email/render";
import path from "path";

import { RESET_PASSWORD_ROUTE } from "@/lib/routes";
import emailVerification from "@/server/service/email/templates/email-verification/email-verification";
import EmailVerification from "@/server/service/email/templates/email-verification/EmailVerification";
import Registration from "@/server/service/email/templates/registration/Registration";
import registration from "@/server/service/email/templates/registration/registration";
import resetPassword from "@/server/service/email/templates/reset-password/reset-password";
import resetPasswordProviders from "@/server/service/email/templates/reset-password/reset-password-providers";
import ResetPassword from "@/server/service/email/templates/reset-password/ResetPassword";
import ResetPasswordProviders from "@/server/service/email/templates/reset-password/ResetPasswordProviders";

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

  async emailVerification() {
    return {
      html: await render(<EmailVerification />),
      text: emailVerification(),
    };
  }
}
