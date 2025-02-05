import EmailTemplateLayout from "@/server/service/email/templates/EmailLayout";

export default function ResetPassword({
  name,
  resetLink,
}: {
  name: string;
  resetLink: string;
}) {
  return (
    <EmailTemplateLayout>
      <p>Hello {name},</p>
      <p>
        To reset your UCI Machine Learning Repository password, please follow
        this link:
      </p>
      <p>
        <a href={resetLink} className="text-blue-500 hover:underline">
          {resetLink}
        </a>
      </p>
      <p>
        The link will be valid for one hour. If you did not request a password
        change, you can ignore this message and continue using your current
        password.
      </p>
    </EmailTemplateLayout>
  );
}
