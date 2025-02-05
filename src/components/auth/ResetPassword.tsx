"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Banner } from "@/components/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const formSchema = z
  .object({
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

export type FormSchema = z.infer<typeof formSchema>;

export default function ResetPassword({ token }: { token: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <>
      {/* Mobile View */}
      <div className="mx-auto flex max-w-[450px] flex-col items-center space-y-4 sm:hidden">
        <div className="text-xl font-bold">Reset your password</div>

        <ResetPasswordForm token={token} form={form} />
      </div>

      {/* Desktop View */}
      <Card className="mx-auto hidden w-[450px] flex-col items-center rounded-4xl p-4 sm:flex">
        <CardHeader className="py-6">
          <Banner variant="logo" link />
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <div className="space-y-2">
            <div className="text-xl font-bold">Reset your password</div>
          </div>
          <ResetPasswordForm token={token} form={form} />
        </CardContent>
      </Card>
    </>
  );
}
