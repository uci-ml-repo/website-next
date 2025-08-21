"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@packages/auth/auth-client";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthButton } from "@/components/auth/button/auth-button";
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
import { ROUTES } from "@/lib/routes";

const formSchema = z.object({
  email: z.string().min(1, { error: "Email is required" }),
  password: z.string().min(1, { error: "Password is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoginCredentialsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callback")?.replaceAll(" ", "+");

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: FormSchema) {
    setError(undefined);
    setIsPending(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL,
    });

    if (data) {
      toast.success(`Signed in as: ${data.user.name}`);
      router.push(ROUTES.HOME);
    } else if (error?.code === "EMAIL_NOT_VERIFIED") {
      router.push(ROUTES.AUTH.VERIFY_EMAIL(email));
    } else {
      if (error?.message) {
        setError(error.message);
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <AuthButton icon={<MailIcon />} type="submit" pending={isPending}>
          Sign in with Email
        </AuthButton>
      </form>
    </Form>
  );
}
