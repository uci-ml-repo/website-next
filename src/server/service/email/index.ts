import * as process from "node:process";

import fs from "fs-extra";
import { OAuth2Client } from "google-auth-library";
import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type SMTPConnection from "nodemailer/lib/smtp-connection";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import { fileURLToPath } from "url";

import { ABOUT_ROUTE, CONTACT_ROUTE, PRIVACY_POLICY_ROUTE } from "@/lib/routes";
import EmailTemplateService from "@/server/service/email/templates";

interface OAuth2Options extends SMTPTransport.Options {
  auth?: SMTPConnection.OAuth2;
}

interface OAuth2Transporter extends Transporter {
  options: OAuth2Options;
}

export default class EmailService {
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

  protected readTemplateTextFile(relativePath: string) {
    return fs.readFileSync(
      path.join(this.templatesFolder, relativePath),
      "utf8",
    );
  }

  protected populateEmailTemplate(
    content: string,
    { name, email }: { name: string; email: string },
  ) {
    if (!process.env.ORIGIN) {
      throw new Error("ORIGIN is not set");
    }

    return content
      .replaceAll("{name}", name)
      .replaceAll("{email}", email)
      .replaceAll("{origin}", process.env.ORIGIN)
      .replaceAll("{about}", path.join(process.env.ORIGIN + ABOUT_ROUTE))
      .replaceAll("{contact}", path.join(process.env.ORIGIN + CONTACT_ROUTE))
      .replaceAll(
        "{privacy}",
        path.join(process.env.ORIGIN + PRIVACY_POLICY_ROUTE),
      );
  }
}
