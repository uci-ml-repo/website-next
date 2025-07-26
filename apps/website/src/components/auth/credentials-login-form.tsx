"use client";

import { AuthButton } from "@components/auth/button/auth-button";
import { Alert, AlertDescription } from "@components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@lib/auth-client";
import { ROUTES } from "@lib/routes";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

export function CredentialsLoginForm() {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function credentialsLogin({ email, password }: FormSchema) {
    setError(undefined);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (data) {
      toast.success(`Signed in as ${data.user.name}`);
      router.push(ROUTES.HOME);
    }

    setError(error?.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(credentialsLogin)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
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
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="current-password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Link
              className="text-muted-foreground text-sm hover:underline"
              href={ROUTES.AUTH.FORGOT_PASSWORD}
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <AuthButton icon={<MailIcon />} type="submit" pending={form.formState.isSubmitting}>
          Sign in with Email
        </AuthButton>
      </form>
    </Form>
  );
}
