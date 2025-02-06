import ErrorGraphic from "@/components/layout/ErrorGraphic";
import Main from "@/components/layout/Main";
import { PROFILE_SETTINGS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const existingToken = await caller.user.credentials.getEmailVerificationToken(
    {
      token,
    },
  );

  if (!existingToken.success) {
    return (
      <ErrorGraphic header={existingToken.message}>
        <div>
          <a
            href={PROFILE_SETTINGS_ROUTE}
            className="text-link hover:underline"
          >
            Generate another token
          </a>
        </div>
      </ErrorGraphic>
    );
  }

  return <Main>X</Main>;
}
