"use client";

import { Separator } from "@components/ui/separator";
import { authClient } from "@lib/auth/auth-client";
import { toast } from "sonner";

export function VerifyContent({ email }: { email: string }) {
  async function resend() {
    await authClient.sendVerificationEmail({ email });
    toast.success(`Resent verification email.`);
  }

  return (
    <div className="space-y-6 text-center">
      <Separator />

      <h1 className="text-xl font-bold">Verify your email</h1>

      <div>
        <div>A verification link has been sent to:</div>
        <div className="font-bold">{email}</div>
      </div>

      <div>
        Click the link in the email to complete your sign up. You may need to check your spam
        folder.
      </div>

      <Separator />

      <div className="text-muted-foreground w-full space-x-1 text-center text-sm">
        <span>Didn't receive an email?</span>
        <button className="text-foreground cursor-pointer hover:underline" onClick={resend}>
          Resend
        </button>
      </div>
    </div>
  );
}
