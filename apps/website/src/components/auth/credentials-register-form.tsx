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
import { TextSeparator } from "@components/ui/text-separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@lib/auth-client";
import { ROUTES } from "@lib/routes";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(255, { message: "Name cannot exceed 255 characters" }),
    email: z.email().max(255, { message: "Email cannot exceed 255 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password cannot exceed 128 characters" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export function CredentialsRegisterForm() {
  const router = useRouter();

  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function credentialsRegister({ name, email, password }: FormSchema) {
    setError(undefined);

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (data) {
      toast.success(`Successfully registered`);
      router.push(ROUTES.HOME);
    }

    setError(error?.message);
  }

  return formOpen ? (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(credentialsRegister)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <motion.div
            className="space-y-2 overflow-y-hidden"
            initial={{ height: 0 }}
            animate={{ height: "fit-content" }}
          >
            <div className="space-y-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input {...field} autoComplete="new-password" type="password" />
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
                      <Input {...field} autoComplete="new-password" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <AuthButton icon={<MailIcon />} type="submit" pending={form.formState.isSubmitting}>
            Register with Email
          </AuthButton>
        </form>
      </Form>
      <TextSeparator text="OR" />
    </div>
  ) : (
    <AuthButton icon={<MailIcon />} onClick={() => setFormOpen(true)}>
      Register with Email
    </AuthButton>
  );
}
