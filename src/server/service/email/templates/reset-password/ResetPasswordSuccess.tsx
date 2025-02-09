import process from "node:process";

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
          href={`mailto:${process.env.GOOGLE_EMAIL}`}
        >
          {process.env.GOOGLE_EMAIL}
        </a>
        .
      </p>
    </EmailLayout>
  );
}
