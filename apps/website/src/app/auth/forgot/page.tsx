import type { Metadata } from "next";

import { ForgotPasswordInputEmailForm } from "@/components/auth/forgot/forgot-password-input-email-form";
import { ForgotPasswordInvalidToken } from "@/components/auth/forgot/forgot-password-invalid-token";
import { ForgotPasswordResetForm } from "@/components/auth/forgot/forgot-password-reset-form";
import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex grow items-center justify-center">
      <Card className="w-full max-w-[30rem] max-md:invisible">
        <CardHeader>
          <MLRepoLogo variant="logo" className="text-wrap" />
        </CardHeader>
        <CardContent>
          {token ? (
            <ForgotPasswordResetForm token={token} />
          ) : error ? (
            <ForgotPasswordInvalidToken />
          ) : (
            <ForgotPasswordInputEmailForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
