import process from "node:process";

export function resetPasswordSuccess({ name }: { name: string }) {
  return `Hello ${name},

You have successfully reset your password. You can now log in using your new password.

If you did not perform this action, contact ${process.env.GOOGLE_EMAIL}.`;
}
