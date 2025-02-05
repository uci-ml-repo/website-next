import type { SendMailOptions } from "nodemailer";
import path from "path";

import EmailService from "@/server/service/email/index";
import ServiceError from "@/server/service/errors";

export default class EmailSendService extends EmailService {
  async sendEmail(options: SendMailOptions) {
    const accessToken = await this.oauth
      .getAccessToken()
      .then((res) => res.token ?? "")
      .catch((error) => {
        throw new ServiceError({
          reason: "Failed to Send Email",
          origin: "Email",
          message: error.message,
        });
      });

    this.transporter.options.auth ??= {};
    this.transporter.options.auth.accessToken = accessToken;

    await this.transporter.sendMail(options).catch((error) => {
      throw new ServiceError({
        reason: "Failed to Send Email",
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
    const html = await this.template.registration(name);
    const text = this.readTemplateTextFile(
      "registration/registration-template.txt",
    );

    await this.sendEmail({
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject:
        "Successfully Registered for the UCI Machine Learning Repository",
      html,
      text: this.populateEmailTemplate(text, { name, email }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(this.templatesFolder, "attachments", "logo.png"),
          cid: "logo",
        },
      ],
    });
  }
}
