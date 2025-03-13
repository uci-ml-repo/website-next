import path from "path";

import { env } from "@/env";
import { SIGN_IN_ROUTE } from "@/lib/routes";
import { EmailLayout } from "@/server/service/email/templates/EmailLayout";

export function ResetPasswordProviders({
  name,
  providers,
}: {
  name: string;
  providers: string[];
}) {
  return (
    <EmailLayout>
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
          href={path.join(env.ORIGIN, SIGN_IN_ROUTE)}
          className="text-blue-500 hover:underline"
        >
          logging in
        </a>{" "}
        using a listed provider.
      </p>
      <p>
        If you did not request a password change, you can ignore this message.
      </p>
    </EmailLayout>
  );
}

export function resetPasswordProviders({
  name,
  providers,
}: {
  name: string;
  providers: string[];
}) {
  return `Hello ${name},
  
We have received a requested to change your password. Our records show that you registered for the UCI Machine Learning Repository using the following providers:

${providers.map((provider) => `- ${provider}`).join("\n")}

To access your account, try logging in with a listed provider.

If you did not request a password change, you can ignore this message.
`;
}
