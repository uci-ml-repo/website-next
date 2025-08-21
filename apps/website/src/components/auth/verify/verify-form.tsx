"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@packages/auth/auth-client";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/routes";

const OTP_LENGTH = 6;

const formSchema = z.object({
  otp: z.string().length(OTP_LENGTH),
});

type FormSchema = z.infer<typeof formSchema>;

export function VerifyForm({ email }: { email: string }) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>(undefined);
  const [resending, setResending] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function resend() {
    setResending(true);
    await authClient.sendVerificationEmail({ email });
    toast.success(`Resent verification email.`);
    setResending(false);
  }

  async function onSubmit({ otp }: FormSchema) {
    const { data, error } = await authClient.emailOtp.verifyEmail({ email, otp });

    if (data) {
      toast.success(`Email successfully verified`);
      router.replace(ROUTES.AUTH.SIGN_IN());
    }

    switch (error?.code) {
      case "INVALID_OTP":
        setError("Invalid or expired passcode");
        break;
      case "MAX_ATTEMPTS_EXCEEDED":
        setError("Too many failed attempts. Please request a new passcode.");
        break;
      default:
        setError(error?.message);
        break;
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Verify your email</h1>

      <div>
        <div>A one time passcode has been sent to:</div>
        <div className="font-bold wrap-anywhere">{email}</div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="my-8 flex flex-col items-center space-y-6"
        >
          {error && (
            <Alert variant="destructive" className="animate-in fade-in">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            name="otp"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>One-Time Passcode</FormLabel>

                <FormControl>
                  <InputOTP maxLength={OTP_LENGTH} {...field}>
                    <InputOTPGroup>
                      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <InputOTPSlot index={i} key={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-68">
            {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
            Verify
          </Button>
        </form>
      </Form>

      <Separator />

      <div className="text-muted-foreground w-full space-x-1 text-center text-sm">
        <span>Didn't receive an email?</span>
        <button
          className="text-foreground cursor-pointer hover:underline"
          onClick={resend}
          disabled={resending}
        >
          Resend
        </button>
      </div>
    </div>
  );
}
