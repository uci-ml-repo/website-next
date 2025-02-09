import { EmailLayout } from "@/server/service/email/templates/EmailLayout";

export function VerificationEmail({
  name,
  verificationLink,
}: {
  name: string;
  verificationLink: string;
}) {
  return (
    <EmailLayout>
      <p>Hello {name},</p>
      <p>Please click the following link to verify your email address:</p>
      <p>
        <a href={verificationLink}>{verificationLink}</a>
      </p>
      <p>
        This link will expire in 5 minutes. If you did not request to verify
        your email, you can ignore this message.
      </p>
    </EmailLayout>
  );
}
