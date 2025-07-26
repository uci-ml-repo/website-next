import { LoginForm } from "@components/auth/login-form";
import { GithubAuth } from "@components/auth/provider/github-auth";
import { GoogleAuth } from "@components/auth/provider/google-auth";
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
        <LoginForm />
        <TextSeparator text="OR" />
        <GoogleAuth />
        <GithubAuth />
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
