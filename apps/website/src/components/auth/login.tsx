import { GithubAuth } from "@components/auth/button/github-auth";
import { GoogleAuth } from "@components/auth/button/google-auth";
import { CredentialsLoginForm } from "@components/auth/credentials-login-form";
import { TextSeparator } from "@components/ui/text-separator";
import type { AuthTab } from "@website/app/auth/login/page";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setTab: Dispatch<SetStateAction<AuthTab>>;
}

export function Login({ setTab }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <CredentialsLoginForm />
        <TextSeparator text="OR" />
        <GoogleAuth>Sign in with Google</GoogleAuth>
        <GithubAuth>Sign in with Github</GithubAuth>
      </div>

      <div className="text-muted-foreground w-full space-x-1 text-center text-sm">
        <span>Don't have an account?</span>
        <button
          className="text-foreground cursor-pointer hover:underline"
          onClick={() => setTab("register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
