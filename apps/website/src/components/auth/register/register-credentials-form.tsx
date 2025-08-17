"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@packages/auth/auth-client";
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
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
import { TextSeparator } from "@/components/ui/text-separator";
import { ROUTES } from "@/lib/routes";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { error: "Name is required" })
      .max(255, { error: "Name cannot exceed 255 characters" }),
    email: z.email(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(128, { error: "Password cannot exceed 128 characters" }),
    confirmPassword: z.string().min(1, { error: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export function RegisterCredentialsForm() {
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

  async function onSubmit({ name, email, password }: FormSchema) {
    setError(undefined);

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (data) {
      router.push(ROUTES.AUTH.VERIFY_EMAIL(email));
    } else if (error?.message) {
      setError(error.message);
    } else {
      toast.error("Failed to register. Please try again.");
    }
  }

  return formOpen ? (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
