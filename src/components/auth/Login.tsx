import { AlertCircleIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import type { useForm } from "react-hook-form";

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
import { trpc } from "@/server/trpc/query/client";

interface LoginProps {
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  redirectTo: string;
  form: ReturnType<typeof useForm<LoginFormSchema>>;
}

export function Login({ setTab, redirectTo, form }: LoginProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();

  const credentialsLoginMutations = trpc.user.credentials.credentialsLogin.useMutation({
    onMutate: () => setError(undefined),
    onError: (error) => setError(error.message),
  });

  async function credentialsLogin(values: LoginFormSchema) {
    credentialsLoginMutations.mutate(values, {
      onSuccess: async (result) => {
        if (result.success) {
          const response = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });
          if (response?.ok) {
            router.replace(redirectTo);
          } else {
            setError("Sign in failed. Please try again.");
          }
        } else {
          setError(result.message ?? "An unknown error occurred");
        }
      },
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
        <form onSubmit={form.handleSubmit(credentialsLogin)} className="space-y-4">
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
            isPending={credentialsLoginMutations.isPending}
          />
        </form>
      </Form>
      <TextDivider text="OR" />
      <AuthButton
        icon={<GoogleIcon />}
        label="Sign in with Google"
        onClick={() =>
          signIn("google", {
            redirect: true,
            redirectTo,
          })
        }
      />
      <AuthButton
        icon={<GithubIcon />}
        label="Sign in with Github"
        onClick={() =>
          signIn("github", {
            redirect: true,
            redirectTo,
          })
        }
      />
      <div className="w-full space-x-1 text-center text-sm text-muted-foreground">
        <span>Don't have an account?</span>
        <button className="text-foreground underline" onClick={() => setTab("register")}>
          Register
        </button>
      </div>
    </div>
  );
}
