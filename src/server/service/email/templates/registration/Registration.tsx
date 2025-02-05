import path from "path";

import { PROFILE_ROUTE } from "@/lib/routes";
import EmailTemplateLayout from "@/server/service/email/templates/EmailLayout";

export default function Registration({ name }: { name: string }) {
  if (!process.env.ORIGIN) {
    throw new Error("ORIGIN is not set");
  }

  return (
    <EmailTemplateLayout>
      <p>Hello {name},</p>
      <p>
        You have successfully created an account for the UCI Machine Learning
        Repository under this email address.
      </p>
      <p>
        You can access your account by visiting{" "}
        <a
          href={path.join(process.env.ORIGIN, PROFILE_ROUTE)}
          className="text-blue-500 hover:underline"
        >
          your profile
        </a>
        .
      </p>
    </EmailTemplateLayout>
  );
}
