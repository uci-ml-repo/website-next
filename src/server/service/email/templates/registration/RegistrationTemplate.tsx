import { PROFILE_ROUTE } from "@/lib/routes";
import EmailTemplateLayout from "@/server/service/email/templates/layout";

export default function RegistrationTemplate({ name }: { name: string }) {
  return (
    <EmailTemplateLayout>
      <div>Hello {name},</div>
      <br />
      <div>
        You have successfully created an account for the UCI Machine Learning
        Repository under this email address.
      </div>
      <br />

      <div>
        You can access your account by visiting{" "}
        <a href={PROFILE_ROUTE} className="text-blue-500 hover:underline">
          your profile
        </a>
      </div>
    </EmailTemplateLayout>
  );
}
