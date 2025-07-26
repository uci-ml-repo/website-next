import { RegisterForm } from "@components/auth/register-form";
import type { AuthTab } from "@website/app/auth/login/page";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setTab: Dispatch<SetStateAction<AuthTab>>;
}

export function Register({ setTab }: Props) {
  return (
    <div>
      <RegisterForm />
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
