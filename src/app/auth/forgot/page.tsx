"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Banner } from "@/components/icons";
import Main from "@/components/layout/Main";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { SIGN_IN_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
});

export default function Page() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordMutation =
    trpc.user.credentials.sendResetPasswordEmail.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
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
    <Main>
      {/* Mobile View */}
      <div className="mx-auto flex max-w-[450px] flex-col items-center space-y-4 sm:hidden">
        <div className="space-y-2">
          <div className="text-xl font-bold">Reset you password</div>
          <div>
            If the email you enter matches an account, we'll send a reset link
            to:
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
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
            <SubmitSuccessful />
            <div className="flex items-center justify-between space-x-2">
              <BackButton />
              <SubmitButton />
            </div>
          </form>
        </Form>
      </div>

      {/* Desktop View */}
      <Card className="mx-auto hidden w-[450px] flex-col items-center rounded-4xl p-4 sm:flex">
        <CardHeader className="py-6">
          <Banner variant="logo" link />
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <div className="space-y-2">
            <div className="text-xl font-bold">Reset you password</div>
            <div>
              If the email you enter matches an account, we'll send a reset code
              to:
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <SubmitSuccessful />
              <div className="flex items-center justify-between space-x-2">
                <BackButton />
                <SubmitButton />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  );
}
