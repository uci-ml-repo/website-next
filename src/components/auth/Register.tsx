import { AlertCircleIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import type { useForm } from "react-hook-form";

import { credentialsRegister, providerLogin } from "@/actions/auth.actions";
import { AuthButton } from "@/components/auth/AuthButton";
import type { RegisterFormSchema, Tab } from "@/components/auth/LoginRegister";
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
import { cn } from "@/lib/utils";

interface RegisterProps {
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  redirectTo: string;
  form: ReturnType<typeof useForm<RegisterFormSchema>>;
  emailFormIsOpen: boolean;
  setEmailFormIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Register({
  setTab,
  redirectTo,
  form,
  emailFormIsOpen,
  setEmailFormIsOpen,
}: RegisterProps) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: RegisterFormSchema) {
    setError(null);
    startTransition(async () => {
      const res = await credentialsRegister(values);
      if (res.success) {
        router.replace(redirectTo);
      } else {
        setError(res.message ?? "An unknown error occurred");
      }
    });
  }

  return (
    <div className="space-y-4">
      {emailFormIsOpen ? (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "fit-content" }}
          className={cn("space-y-4 overflow-y-hidden", "-mx-1 px-1")}
        >
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
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AuthButton
                icon={<MailIcon />}
                label="Register with Email"
                type="submit"
                isPending={isPending}
              />
            </form>
          </Form>
          <TextDivider text="OR" />
        </motion.div>
      ) : (
        <AuthButton
          icon={<MailIcon />}
          label="Register with Email"
          isPending={isPending}
          onClick={() => setEmailFormIsOpen(true)}
        />
      )}

      <AuthButton
        icon={<GoogleIcon />}
        label="Register with Google"
        onClick={async () => {
          await providerLogin({ provider: "google", redirectTo });
        }}
      />
      <AuthButton
        icon={<GithubIcon />}
        label="Register with Github"
        onClick={async () => {
          await providerLogin({ provider: "github", redirectTo });
        }}
      />
      <p className="w-full space-x-1 text-center text-sm text-muted-foreground">
        <span>Have an account?</span>
        <button
          className="cursor-pointer text-foreground underline"
          onClick={() => setTab("signin")}
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
