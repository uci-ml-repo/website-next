"use client";

import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@lib/auth/auth-client";
import { ROUTES } from "@lib/routes";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.email(),
});

type FormSchema = z.infer<typeof formSchema>;

export function ForgotPasswordInputEmailForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: FormSchema) {
    await authClient.requestPasswordReset({
      email,
      redirectTo: ROUTES.AUTH.FORGOT_PASSWORD,
    });
  }

  return form.formState.isSubmitSuccessful ? (
    <div className="space-y-4 text-center">
      <div className="text-pretty">
        If a user with the email <span className="font-bold">{form.getValues("email")}</span>{" "}
        exists, a link will be sent with instructions for resetting your password.
      </div>
      <Separator />
      <button
        className="text-muted-foreground cursor-pointer hover:underline"
        onClick={() => form.reset()}
      >
        Try another email
      </button>
    </div>
  ) : (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Reset password</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2">
                  Provide the email address associated with your account.
                </FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
            spinner={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
