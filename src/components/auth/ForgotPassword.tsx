"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Banner } from "@/components/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  return (
    <>
      {/* Mobile View */}
      <div className="mx-auto flex max-w-[450px] flex-col items-center space-y-4 sm:hidden">
        <div className="space-y-2">
          <div className="text-xl font-bold">Reset your password</div>
          <div>
            If the email you enter matches an account, we'll send a reset link
            to:
          </div>
          <ForgotPasswordForm form={form} />
        </div>
      </div>

      {/* Desktop View */}
      <Card className="mx-auto hidden w-[450px] flex-col items-center rounded-4xl p-4 sm:flex">
        <CardHeader className="py-6">
          <Banner variant="logo" link />
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <div className="space-y-2">
            <div className="text-xl font-bold">Reset your password</div>
            <div>
              If the email you enter matches an account, we'll send a reset code
              to:
            </div>
          </div>
          <ForgotPasswordForm form={form} />
        </CardContent>
      </Card>
    </>
  );
}
