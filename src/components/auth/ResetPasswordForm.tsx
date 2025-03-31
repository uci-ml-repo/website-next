"use client";

import { AlertCircleIcon, CheckIcon } from "lucide-react";
import type { useForm } from "react-hook-form";

import type { FormSchema } from "@/components/auth/ResetPassword";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { SIGN_IN_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function ResetPasswordForm({
  token,
  form,
}: {
  token: string;
  form: ReturnType<typeof useForm<FormSchema>>;
}) {
  const resetPasswordMutation = trpc.user.credentials.resetPassword.useMutation();

  function onSubmit(values: FormSchema) {
    resetPasswordMutation.mutate({
      token,
      password: values.password,
    });
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="space-y-6">
        <Alert variant="positive">
          <div className="flex items-center space-x-2">
            <CheckIcon />
            <span className="text-base">Successfully changed password</span>
          </div>
        </Alert>
        <div className="text-center">
          You can now{" "}
          <a href={SIGN_IN_ROUTE} className="text-link hover:underline">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {resetPasswordMutation.error && (
          <Alert variant="destructive">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="size-4" />
              <AlertDescription>{resetPasswordMutation.error.message}</AlertDescription>
            </div>
          </Alert>
        )}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          variant="blue"
          className="w-full"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending && <Spinner />} Reset Password
        </Button>
      </form>
    </Form>
  );
}
