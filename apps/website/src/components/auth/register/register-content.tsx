import type { Dispatch, SetStateAction } from "react";

import type { AuthTab } from "@/app/auth/login/page";
import { GithubAuth } from "@/components/auth/button/github-auth";
import { GoogleAuth } from "@/components/auth/button/google-auth";
import { RegisterCredentialsForm } from "@/components/auth/register/register-credentials-form";

interface Props {
  setTab: Dispatch<SetStateAction<AuthTab>>;
}

export function RegisterContent({ setTab }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <RegisterCredentialsForm />
        <GoogleAuth>Register with Google</GoogleAuth>
        <GithubAuth>Register with Github</GithubAuth>
      </div>

      <div className="text-muted-foreground w-full space-x-1 text-center text-sm">
        <span>Have an account?</span>
        <button
          className="text-foreground cursor-pointer hover:underline"
          onClick={() => setTab("signIn")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
