import { AlertCircleIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import type { useForm } from "react-hook-form";

import { credentialsLogin, providerLogin } from "@/actions/auth.actions";
import { AuthButton } from "@/components/auth/AuthButton";
import type { LoginFormSchema, Tab } from "@/components/auth/LoginRegister";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { TextDivider } from "@/components/ui/text-divider";
import { FORGOT_PASSWORD_ROUTE } from "@/lib/routes";

interface LoginProps {
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  redirectTo: string;
  form: ReturnType<typeof useForm<LoginFormSchema>>;
}

export function Login({ setTab, redirectTo, form }: LoginProps) {
  const router = useRouter();

  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: LoginFormSchema) {
    setError(undefined);
    startTransition(async () => {
      const res = await credentialsLogin(values);
      if (res.success) {
        router.replace(redirectTo);
      } else {
        setError(res.message ?? "An unknown error occurred");
      }
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        {error && (
          <Alert variant="destructive">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete="current-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Link
              className="text-sm text-muted-foreground hover:underline"
              href={FORGOT_PASSWORD_ROUTE}
            >
              Forgot Password?
            </Link>
          </div>
          <AuthButton
            icon={<MailIcon />}
            label="Sign in with Email"
            type="submit"
            isPending={isPending}
          />
        </form>
      </Form>

      <TextDivider text="OR" />
      <AuthButton
        icon={<GoogleIcon />}
        label="Sign in with Google"
        onClick={async () => {
          await providerLogin({ provider: "google", redirectTo });
        }}
      />
      <AuthButton
        icon={<GithubIcon />}
        label="Sign in with Github"
        onClick={async () => {
          await providerLogin({ provider: "github", redirectTo });
        }}
      />
      <div className="w-full space-x-1 text-center text-sm text-muted-foreground">
        <span>Don't have an account?</span>
        <button
          className="text-foreground underline"
          onClick={() => setTab("register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
