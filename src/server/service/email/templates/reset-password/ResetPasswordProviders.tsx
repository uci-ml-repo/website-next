import * as process from "node:process";

import path from "path";

import { SIGN_IN_ROUTE } from "@/lib/routes";
import EmailTemplateLayout from "@/server/service/email/templates/EmailLayout";

export default function ResetPasswordProviders({
  name,
  providers,
}: {
  name: string;
  providers: string[];
}) {
  if (!process.env.ORIGIN) {
    throw new Error("ORIGIN is not set");
  }

  return (
    <EmailTemplateLayout>
      <p>Hello {name},</p>
      <p>
        We have received a requested to change your password. Our records show
        that you registered for the UCI Machine Learning Repository using the
        following providers:
      </p>
      <ul>
        {providers &&
          providers.map((provider) => <li key={name}>{provider}</li>)}
      </ul>
      <p>
        To access you account, try{" "}
        <a
          href={path.join(process.env.ORIGIN, SIGN_IN_ROUTE)}
          className="text-blue-500 hover:underline"
        >
          logging in
        </a>{" "}
        using a listed provider.
      </p>
      <p>
        If you did not request a password change, you can ignore this message.
      </p>
    </EmailTemplateLayout>
  );
}
