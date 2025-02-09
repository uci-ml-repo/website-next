import type { Metadata } from "next";

import { ResetPassword } from "@/components/auth/ResetPassword";
import { ErrorGraphic } from "@/components/layout/ErrorGraphic";
import { Main } from "@/components/layout/Main";
import { FORGOT_PASSWORD_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const existingToken = await caller.user.credentials.getResetPasswordToken({
    token,
  });

  if (!existingToken.success) {
    return (
      <ErrorGraphic header={existingToken.message}>
        <div>
          <a href={FORGOT_PASSWORD_ROUTE} className="text-link hover:underline">
            Generate another token
          </a>
        </div>
      </ErrorGraphic>
    );
  }

  return (
    <Main>
      <ResetPassword token={token} />
    </Main>
  );
}
