import path from "path";

import { SIGN_IN_ROUTE } from "@/lib/routes";
import { EmailLayout } from "@/server/service/email/templates/EmailLayout";

export function ResetPasswordSuccess({ name }: { name: string }) {
  if (!process.env.ORIGIN) {
    throw new Error("ORIGIN is not set");
  }

  if (!process.env.GOOGLE_EMAIL) {
    throw new Error("GOOGLE_EMAIL is not set");
  }

  return (
    <EmailLayout>
      <p>Hello {name},</p>
      <p>
        You have successfully reset your password. You can now{" "}
        <a
          className="text-blue-500 hover:underline"
          href={path.join(process.env.ORIGIN, SIGN_IN_ROUTE)}
        >
          log in
        </a>{" "}
        using your new password.
      </p>
      <p>
        If you did not perform this action, contact{" "}
        <a
          className="text-blue-500 hover:underline"
          href="mailto:ml-repository@ics.uci.edu"
        >
          ml-repository@ics.uci.edu
        </a>
        .
      </p>
    </EmailLayout>
  );
}

export function resetPasswordSuccess({ name }: { name: string }) {
  return `Hello ${name},

You have successfully reset your password. You can now log in using your new password.

If you did not perform this action, contact ml-repository@ics.uci.edu.`;
}
