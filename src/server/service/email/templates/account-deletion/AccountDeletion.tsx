import { EmailLayout } from "@/server/service/email/templates/EmailLayout";

export function AccountDeletion({ name }: { name: string }) {
  return (
    <EmailLayout>
      <p>Hello {name},</p>
      <p>You have successfully deleted your UCI Machine Learning Repository account.</p>
      <p>
        If you did not perform this action, contact{" "}
        <a className="text-blue-500 hover:underline" href="mailto:ml-repository@ics.uci.edu">
          ml-repository@ics.uci.edu
        </a>
        .
      </p>
    </EmailLayout>
  );
}

export function accountDeletion({ name }: { name: string }) {
  return `Hello ${name},
  
You have successfully deleted your UCI Machine Learning Repository account.

If you did not perform this action, contact ml-repository@ics.uci.edu.`;
}
