import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { credentialsLogin, providerLogin } from "@/actions/auth.actions";
import type { Tab } from "@/app/auth/login/page";
import AuthButton from "@/components/auth/AuthButton";
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
import TextDivider from "@/components/ui/text-divider";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

interface LoginProps {
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  redirectTo: string;
}

export default function Login({ setTab, redirectTo }: LoginProps) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const res = await credentialsLogin(values);
      if (res.success) {
        router.replace(redirectTo);
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <div className={"space-y-4"}>
      <Form {...form}>
        {error && (
          <Alert variant="destructive">
            <div className={"flex items-center space-x-2"}>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className={"space-y-2"}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={"email"}
                      autoComplete={"username"}
                    />
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
                    <PasswordInput
                      {...field}
                      autoComplete={"current-password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <AuthButton
            icon={<MailIcon />}
            label={`Sign in with Email`}
            type={"submit"}
            isPending={isPending}
          />
        </form>
      </Form>

      <TextDivider text={"OR"} />
      <AuthButton
        icon={<GoogleIcon />}
        label={`Sign in with Google`}
        onClick={async () => {
          await providerLogin({ provider: "google", redirectTo });
        }}
      />
      <AuthButton
        icon={<GithubIcon />}
        label={`Sign in with Github`}
        onClick={async () => {
          await providerLogin({ provider: "github", redirectTo });
        }}
      />
      <p
        className={"w-full space-x-1 text-center text-sm text-muted-foreground"}
      >
        <span>Don't have an account?</span>
        <span
          className={"cursor-pointer text-foreground underline"}
          onClick={() => setTab("register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}
