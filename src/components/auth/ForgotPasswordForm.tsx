"use client";

import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { useForm } from "react-hook-form";

import type { FormSchema } from "@/components/auth/ForgotPassword";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SIGN_IN_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function ForgotPasswordForm({
  form,
}: {
  form: ReturnType<typeof useForm<FormSchema>>;
}) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const resetPasswordMutation =
    trpc.user.credentials.sendResetPasswordEmail.useMutation();

  function onSubmit(values: FormSchema) {
    resetPasswordMutation.mutate({
      email: values.email,
    });

    setSubmittedEmail(values.email);
  }

  const inputEmail = form.watch("email");

  const BackButton = () => {
    return (
      <Button className="px-3" variant="ghost" type="button" size="lg" asChild>
        <Link href={SIGN_IN_ROUTE}>
          <ArrowLeftIcon /> Back
        </Link>
      </Button>
    );
  };

  const SubmitButton = () => {
    return (
      (!resetPasswordMutation.isSuccess || submittedEmail !== inputEmail) && (
        <Button
          variant="blue"
          type="submit"
          size="lg"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? <Spinner /> : <MailIcon />}Next
        </Button>
      )
    );
  };

  const SubmitSuccessful = () => {
    return (
      resetPasswordMutation.isSuccess &&
      submittedEmail === inputEmail && (
        <Alert variant="positive" className="flex items-center justify-between">
          <div>Email sent</div>
          <button type="submit" className="text-link">
            Resend
          </button>
        </Alert>
      )
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitSuccessful />
        <div className="flex items-center justify-between space-x-2">
          <BackButton />
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
