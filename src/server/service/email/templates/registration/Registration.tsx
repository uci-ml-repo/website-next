import path from "path";

import { env } from "@/env";
import { PROFILE_SETTINGS_ROUTE } from "@/lib/routes";
import { EmailLayout } from "@/server/service/email/templates/EmailLayout";

export function Registration({ name }: { name: string }) {
  return (
    <EmailLayout>
      <p>Hello {name},</p>
      <p>
        You have successfully created an account for the UCI Machine Learning Repository under this
        email address.
      </p>
      <p>
        You can access your account by visiting{" "}
        <a
          href={path.join(env.ORIGIN, PROFILE_SETTINGS_ROUTE)}
          className="text-blue-500 hover:underline"
        >
          your profile
        </a>
        .
      </p>
    </EmailLayout>
  );
}

export function registration({ name }: { name: string }) {
  return `Hello ${name},
  
You have successfully created an account for the UCI Machine Learning Repository under this email address.`;
}
