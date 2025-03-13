import { OAuth2Client } from "google-auth-library";
import type { SendMailOptions, Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type SMTPConnection from "nodemailer/lib/smtp-connection";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "@/env";
import { EmailTemplateService } from "@/server/service/email/templates";
import { ServiceError } from "@/server/service/errors";

interface OAuth2Options extends SMTPTransport.Options {
  auth?: SMTPConnection.OAuth2;
}

interface OAuth2Transporter extends Transporter {
  options: OAuth2Options;
}

export class EmailService {
  oauth: OAuth2Client;
  transporter: OAuth2Transporter;
  templatesFolder: string;

  constructor(readonly template = new EmailTemplateService()) {
    this.oauth = new OAuth2Client({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: "https://developers.google.com/oauthplayground",
    });

    this.oauth.setCredentials({
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
    });

    this.transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: env.GOOGLE_EMAIL,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        refreshToken: env.GOOGLE_REFRESH_TOKEN,
      },
    });

    this.templatesFolder = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "templates",
    );
  }

  async sendEmail(options: SendMailOptions) {
    const accessToken = await this.oauth
      .getAccessToken()
      .then((res) => res.token ?? "")
      .catch((error) => {
        throw new ServiceError({
          origin: "Email",
          message: error.message,
        });
      });

    this.transporter.options.auth ??= {};
    this.transporter.options.auth.accessToken = accessToken;

    await this.transporter.sendMail(options).catch((error) => {
      throw new ServiceError({
        origin: "Email",
        message: error.message,
      });
    });
  }

  async sendRegistrationEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    const { html, text } = await this.template.registration(name);

    await this.sendEmail({
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: "Successfully Registered - UCI Machine Learning Repository",
      html,
      text,
    });
  }

  async sendResetPasswordEmail({
    email,
    name,
    token,
  }: {
    email: string;
    name: string;
    token: string;
  }) {
    const { html, text } = await this.template.resetPassword({
      name,
      token,
    });

    await this.sendEmail({
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: "Password Reset - UCI Machine Learning Repository",
      html,
      text,
    });
  }

  async sendResetPasswordProvidersEmail({
    email,
    name,
    providers,
  }: {
    email: string;
    name: string;
    providers: string[];
  }) {
    const { html, text } = await this.template.resetPasswordProviders({
      name,
      providers,
    });

    await this.sendEmail({
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: "Password Reset - UCI Machine Learning Repository",
      html,
      text,
    });
  }

  async sendResetPasswordSuccessEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    const { html, text } = await this.template.resetPasswordSuccess({ name });

    await this.sendEmail({
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: "Password Reset - UCI Machine Learning Repository",
      html,
      text,
    });
  }

  async sendVerificationEmail({
    email,
    name,
    token,
  }: {
    email: string;
    name: string;
    token: string;
  }) {
    const { html, text } = await this.template.verificationEmail({
      name,
      token,
    });

    await this.sendEmail({
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: "Verify Email - UCI Machine Learning Repository",
      html,
      text,
    });
  }

  async sendAccountDeletionEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    const { html, text } = await this.template.accountDeletion({ name });

    await this.sendEmail({
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: "Account Deletion - UCI Machine Learning Repository",
      html,
      text,
    });
  }
}
