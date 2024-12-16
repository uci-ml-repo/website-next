import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { credentialsRegister, providerLogin } from "@/actions/auth.actions";
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

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(255, { message: "Name cannot exceed 255 characters" }),
    email: z
      .string()
      .email()
      .max(255, { message: "Email cannot exceed 255 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface RegisterProps {
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  redirectTo: string;
}

export default function Register({ setTab, redirectTo }: RegisterProps) {
  const router = useRouter();

  const [emailFormIsOpen, setEmailFormIsOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const res = await credentialsRegister(values);
      if (res.success) {
        router.replace(redirectTo);
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <div className={"space-y-4"}>
      {emailFormIsOpen ? (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "fit-content" }}
          className={"space-y-4 overflow-y-hidden"}
        >
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
                        <Input {...field} pill type={"email"} />
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
                        <Input {...field} pill />
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
                        <PasswordInput {...field} pill />
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
                        <PasswordInput {...field} pill />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AuthButton
                icon={<MailIcon />}
                label={`Register with Email`}
                type={"submit"}
                isPending={isPending}
              />
            </form>
          </Form>
          <TextDivider text={"OR"} />
        </motion.div>
      ) : (
        <AuthButton
          icon={<MailIcon />}
          label={`Register with Email`}
          isPending={isPending}
          onClick={() => setEmailFormIsOpen(true)}
        />
      )}

      <AuthButton
        icon={<GoogleIcon />}
        label={`Register with Google`}
        onClick={async () => {
          await providerLogin({ provider: "google", redirectTo });
        }}
      />
      <AuthButton
        icon={<GithubIcon />}
        label={`Register with Github`}
        onClick={async () => {
          await providerLogin({ provider: "github", redirectTo });
        }}
      />
      <p
        className={"w-full space-x-1 text-center text-sm text-muted-foreground"}
      >
        <span>Have an account?</span>
        <span
          className={"cursor-pointer text-foreground underline"}
          onClick={() => setTab("signin")}
        >
          Sign In
        </span>
      </p>
    </div>
  );
}
