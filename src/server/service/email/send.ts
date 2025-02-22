import { EmailService } from "@/server/service/email/index";

export class EmailSendService extends EmailService {
  async sendRegistrationEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    const { html, text } = await this.template.registration(name);

    await this.sendEmail({
      from: process.env.GOOGLE_EMAIL,
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
    const { html, text } = await this.template.resetPassword({ name, token });

    await this.sendEmail({
      from: process.env.GOOGLE_EMAIL,
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
      from: process.env.GOOGLE_EMAIL,
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
      from: process.env.GOOGLE_EMAIL,
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
      from: process.env.GOOGLE_EMAIL,
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
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "Account Deletion - UCI Machine Learning Repository",
      html,
      text,
    });
  }
}
