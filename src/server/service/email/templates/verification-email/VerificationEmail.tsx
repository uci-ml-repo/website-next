import EmailTemplateLayout from "@/server/service/email/templates/EmailLayout";

export default function VerificationEmail({
  name,
  verificationLink,
}: {
  name: string;
  verificationLink: string;
}) {
  return (
    <EmailTemplateLayout>
      <p>Hello {name},</p>
      <p>Click the following link to verify your email address:</p>
      <p>
        <a href={verificationLink}>{verificationLink}</a>
      </p>
      <p>
        This link will expire in 5 minutes. If you did not request to verify
        your email, you can ignore this message.
      </p>
    </EmailTemplateLayout>
  );
}
