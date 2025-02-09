import * as process from "node:process";

import { OAuth2Client } from "google-auth-library";
import type { SendMailOptions, Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type SMTPConnection from "nodemailer/lib/smtp-connection";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import { fileURLToPath } from "url";

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
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: "https://developers.google.com/oauthplayground",
    });

    this.oauth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
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
}
